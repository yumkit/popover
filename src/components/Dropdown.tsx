import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Placement, Modifiers } from 'popper.js';
import { Manager, Reference, Popper, PopperChildrenProps } from 'react-popper';

import PlacementListener from './PlacementListener';
import MountListener from './MountListener';

type DropdownState = 'opened' | 'closed' | 'calculating';

export interface DropdownOptions extends PopperChildrenProps {
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
  modifiers?: Modifiers;
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
    modifiers,
    placement,
    eventsEnabled,
  };

  const content = preCalculatedPlacement ? (
    <Popper {...popperProps}>
      {popperChildProps =>
        renderDropdown({
          ...popperChildProps,
          state: isOpened ? 'opened' : 'closed',
          placement: popperChildProps.placement || preCalculatedPlacement,
          style: popperChildProps.style,
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
    </Popper>
  ) : (
    <Popper {...popperProps}>
      {popperChildProps => (
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
    </Popper>
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
    <Manager>
      <Reference>
        {({ ref }) => {
          // We assign ref to the children
          // This allows us to calculate its' position and dimensions
          return React.cloneElement(children, { ref });
        }}
      </Reference>

      {dropdown}
    </Manager>
  );
};

Dropdown.defaultProps = {
  placement: 'bottom-start',
};

export default Dropdown;
