import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Placement, Modifier } from '@popperjs/core';
import Popper, { PopperRenderOptions } from './Popper';

import PlacementListener from './PlacementListener';
import MountListener from './MountListener';

type DropdownState = 'opened' | 'closed' | 'calculating';

export interface DropdownOptions extends PopperRenderOptions {
  /** The result of renderContent */
  content: React.ReactNode;

  /** Current dropdown state */
  state: DropdownState;
}

export interface DropdownProps {
  /** A reference element */
  children: React.ReactElement;

  /** A function to render dropdown */
  renderDropdown: (options: DropdownOptions) => any;

  /** A function to render content */
  renderContent: () => any;

  /** Is dropdown opened? */
  isOpened: boolean;

  /** Render dropdown inside a portal? */
  usePortal?: boolean;

  /** Where portal should be mounted */
  portalTarget?: HTMLElement;

  /** react-popper props (https://github.com/popperjs/react-popper) */
  eventsEnabled?: boolean;
  placement?: Placement;
  modifiers?: Array<Partial<Modifier<any>>>;
}

const Dropdown = (props: DropdownProps) => {
  const {
    children,
    placement,
    isOpened,
    usePortal,
    portalTarget,
    renderContent,
    renderDropdown,
    eventsEnabled,
    modifiers,
  } = props;

  // Force a single node as children
  React.Children.only(children);

  const referenceRef = React.useRef(null);

  // Store a pre-calculated position of a dropdown
  // This is required for placement-based animations to work
  const [preCalculatedPlacement, setPreCalculatedPlacement] = React.useState(
    null
  );

  // Required for handling useEffect only after mount
  const isMounted = React.useRef(false);

  // This state is required for dropdown lifecycle hooks to work
  const pendingUnmount = React.useRef(!isOpened);
  const [isDropdownMounted, setDropdownMounted] = React.useState(isOpened);

  React.useEffect(() => {
    if (isMounted.current) {
      // Mount dropdown on open
      if (isOpened) {
        pendingUnmount.current = false;

        setDropdownMounted(true);
      } else if (isDropdownMounted) {
        // Avoid onUnmount calls when user reopens dropdown before it's unmounted
        pendingUnmount.current = true;
      }
    } else {
      isMounted.current = true;
    }
  }, [isOpened]); // eslint-disable-line react-hooks/exhaustive-deps

  // Popper props
  const popperProps = {
    // modifiers,
    // placement,
    // eventsEnabled,
    // referenceRef
    referenceRef,
  };

  const content = preCalculatedPlacement ? (
    <Popper
      {...popperProps}
      render={popperOptions =>
        renderDropdown({
          ...popperOptions,
          state: isOpened ? 'opened' : 'closed',
          placement: placement || preCalculatedPlacement,
          content: (
            <MountListener
              onUnmount={() => {
                // Handle onUnmount if dropdown is closing
                if (pendingUnmount.current) {
                  setPreCalculatedPlacement(null);
                  setDropdownMounted(false);
                }
              }}
            >
              {renderContent()}
            </MountListener>
          ),
        })
      }
    ></Popper>
  ) : (
    <Popper
      {...popperProps}
      render={popperChildProps => (
        <PlacementListener
          placement={popperChildProps.placement}
          onPlacement={setPreCalculatedPlacement}
        >
          {renderDropdown({
            ...popperChildProps,
            state: 'calculating',
            // Hide the dummy dropdown
            style: {
              ...popperChildProps.style,
              visibility: 'hidden',
            },
            content: renderContent(),
          })}
        </PlacementListener>
      )}
    />
  );

  let dropdown;

  if (isDropdownMounted) {
    if (usePortal) {
      // Check for SSR and render portal
      dropdown =
        typeof window !== 'undefined'
          ? ReactDOM.createPortal(content, portalTarget || document.body)
          : null;
    } else {
      dropdown = content;
    }
  }
  return (
    <>
      {React.cloneElement(children, { ref: referenceRef })}

      {dropdown}
    </>
  );
};

Dropdown.defaultProps = {
  placement: 'bottom-start',
};

export default Dropdown;
