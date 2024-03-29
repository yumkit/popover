import * as React from 'react';
import * as ReactDOM from 'react-dom';

import useCallbackRef from '@restart/hooks/useCallbackRef';
import useMergedRefs from '@restart/hooks/useMergedRefs';

import { DropdownProps } from './types';

import usePopper from './usePopper';

import useTrigger from './useTrigger';

import PlacementListener from './PlacementListener';
import MountListener from './MountListener';
import VirtualElement from './VirtualElement';

const defaultRenderDropdown: DropdownProps['renderDropdown'] = ({
  opened,
  content,
  style,
  ref,
}) =>
  opened ? (
    <div ref={ref} style={style}>
      {content}
    </div>
  ) : null;

const Dropdown = (props: DropdownProps) => {
  const {
    children,
    placement,
    usePortal,
    portalTarget,
    overflowBoundary,
    renderContent,
    renderDropdown,
    renderCalculating,
    eventsEnabled,
    modifiers,
    offsets,
    tether = false,
    onOpen,
    onClose,
  } = props;

  const [popperElement, setPopperRef] = useCallbackRef();
  const [referenceElement, setReferenceRef] = useCallbackRef();
  const [virtualElement, setVirtualRef] = useCallbackRef();
  const [arrowElement, setArrowRef] = useCallbackRef();

  const {
    isOpened,
    referenceProps,
    contentProps,
    contentOptions,
    cursorPosition,
    renderVirtual,
  } = useTrigger(props, {
    referenceElement,
    popperElement,
  });

  // Force a single node as children
  React.Children.only(children);

  // Store a pre-calculated position of a dropdown
  // This is required for placement-based animations to work
  const [preCalculatedPlacement, setPreCalculatedPlacement] = React.useState(
    null
  );

  // Required for handling useEffect only after mount
  const isMounted = React.useRef(false);

  const isOpenedRef = React.useRef();

  // This state is required for dropdown lifecycle hooks to work
  const pendingUnmount = React.useRef(!isOpened);
  const [isDropdownMounted, setDropdownMounted] = React.useState(isOpened);

  React.useEffect(() => {
    if (isMounted.current) {
      // Mount dropdown on open
      if (isOpened) {
        pendingUnmount.current = false;

        setDropdownMounted(true);

        // Fire callbacks
        if (onOpen) {
          onOpen();
        }
      } else if (isDropdownMounted) {
        // Avoid onUnmount calls when user reopens dropdown before it's unmounted
        pendingUnmount.current = true;

        // Fire callbacks
        if (onClose) {
          onClose();
        }
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
    referenceElement,
    popperElement,
    arrowElement,
    offsets,
  };

  const popperState = usePopper({
    referenceElement: renderVirtual ? virtualElement : referenceElement,
    popperElement,
    arrowElement,
    options: popperProps,
    overflowBoundary,
    tether,
  });

  const contentRenderArgs = React.useMemo(() => {
    const { style, arrowStyles, ...popperChildProps } = popperState;

    const arrowProps = {
      style: arrowStyles,
      ref: setArrowRef,
    };

    if (preCalculatedPlacement) {
      const currentPlacement =
        popperChildProps.placement || preCalculatedPlacement;

      return {
        ...popperChildProps,
        ...contentOptions,
        placement: currentPlacement,
        props: contentProps,
        arrowProps,
      };
    } else {
      return {
        ...popperChildProps,
        ...contentOptions,
        props: {},
        arrowProps,
      };
    }
  }, [
    preCalculatedPlacement,
    contentOptions,
    contentProps,
    setArrowRef,
    popperState,
  ]);

  const content = React.useMemo(() => {
    const { style } = popperState;

    if (preCalculatedPlacement) {
      const renderer = renderDropdown || defaultRenderDropdown;

      return renderer({
        opened: isOpened,
        ref: setPopperRef,
        placement: contentRenderArgs.placement,
        style,
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
            {renderContent(contentRenderArgs)}
          </MountListener>
        ),
      });
    }

    const renderer =
      renderCalculating || renderDropdown || defaultRenderDropdown;

    return (
      <PlacementListener
        placement={popperState.placement}
        onPlacement={setPreCalculatedPlacement}
      >
        {renderer({
          opened: true,
          ref: setPopperRef,
          style: {
            ...style,
            visibility: 'hidden',
          },
          // Hide the dummy dropdown
          // use calculating to understand that's dummy dropdown
          content: renderContent({ ...contentRenderArgs, calculating: true }),
        })}
      </PlacementListener>
    );
  }, [
    popperState,
    preCalculatedPlacement,
    renderCalculating,
    renderDropdown,
    setPopperRef,
    renderContent,
    contentRenderArgs,
    isOpened,
  ]);

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

  // Allow reference to have its own ref
  const composedRef = useMergedRefs(children.props.ref, setReferenceRef);

  return (
    <>
      {React.cloneElement(children, { ref: composedRef, ...referenceProps })}

      <React.Fragment
        key={
          renderVirtual ? `${cursorPosition.x}-${cursorPosition.y}` : undefined
        }
      >
        {dropdown}
      </React.Fragment>

      {renderVirtual && (
        <VirtualElement ref={setVirtualRef} {...cursorPosition} />
      )}
    </>
  );
};

Dropdown.defaultProps = {
  placement: 'bottom',
};

export default Dropdown;
