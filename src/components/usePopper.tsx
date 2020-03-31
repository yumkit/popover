import * as React from 'react';

import { Offsets } from './types';

import {
  Modifier,
  ModifierArguments,
  Placement,
  PositioningStrategy,
  createPopper,
} from '@popperjs/core';

const initialPopperStyles: Partial<CSSStyleDeclaration> = {
  position: 'absolute',
  top: '0',
  left: '0',
  opacity: '0',
  pointerEvents: 'none',
};

const initialArrowStyles: Partial<CSSStyleDeclaration> = {
  position: 'absolute',
};

export interface PopperHookArgs {
  referenceElement: any;
  overflowBoundary: any;
  popperElement: any;
  arrowElement: any;
  options?: PopperOptions;
  tether?: boolean;
}

export interface PopperOptions {
  placement?: Placement;
  strategy?: PositioningStrategy;
  eventsEnabled?: boolean;
  enabled?: boolean;
  modifiers?: Array<Partial<Modifier<any>>>;
  offsets: Offsets;
}

export interface PopperState {
  placement: Placement;
  scheduleUpdate: () => void;
  outOfBoundaries: boolean;
  style: Partial<CSSStyleDeclaration>;
  arrowStyles: Partial<CSSStyleDeclaration>;
}

const defaultModifiers = [
  {
    name: 'applyStyles',
    enabled: false,
  },
];

const usePopper = ({
  referenceElement,
  popperElement,
  overflowBoundary,
  arrowElement,
  options,
  tether,
}: PopperHookArgs): PopperState => {
  const {
    placement,
    strategy = 'absolute',
    eventsEnabled = true,
    enabled = true,
    modifiers: userModifiers = [],
    offsets,
  } = options || {};

  const modifiers = [...defaultModifiers, ...userModifiers];

  // This value will store the return value of createPopper
  const popperInstanceRef = React.useRef(null);

  // This callback should be called to force popper update
  const scheduleUpdate = React.useCallback(() => {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.update();
    }
  }, []);

  const [state, setState] = React.useState({
    placement: null,
    scheduleUpdate,
    outOfBoundaries: false,
    style: initialPopperStyles,
    arrowStyles: initialArrowStyles,
  });

  const updateModifier = React.useMemo(
    (): Modifier<any> => ({
      name: 'updateState',
      enabled: true,
      phase: 'afterWrite',
      requires: ['computeStyles'],
      fn: (data: ModifierArguments<any>) => {
        setState({
          scheduleUpdate,
          outOfBoundaries: !!data.state.modifiersData.hide?.isReferenceHidden,
          placement: data.state.placement,
          style: { ...data.state.styles?.popper },
          arrowStyles: {
            ...data.state.styles?.arrow,
          },
        });
      },
    }),
    [scheduleUpdate, setState]
  );

  if (!eventsEnabled) {
    modifiers.push({
      name: 'eventListeners',
      enabled: false,
    });
  }

  modifiers.push({
    name: 'flip',
    enabled: true,
    phase: 'main',
    options: {
      boundary: overflowBoundary || 'clippingParents',
    },
  });

  if (tether) {
    modifiers.push({
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      options: {
        boundary: overflowBoundary || 'clippingParents',
      },
    });
  }

  if (offsets) {
    const offsetsOption =
      typeof offsets === 'function'
        ? ({ placement }: { placement: Placement }) => offsets(placement)
        : offsets;

    modifiers.push({
      name: 'offset',
      enabled: true,
      options: {
        offset: offsetsOption,
      },
    });
  }

  if (arrowElement) {
    modifiers.push({
      name: 'arrow',
      options: {
        element: arrowElement,
      },
    });
  }

  // A placement difference in state means popper determined a new placement
  // apart from the props value. By the time the popper element is rendered with
  // the new position Popper has already measured it, if the place change triggers
  // a size change it will result in a misaligned popper. So we schedule an update to be sure.
  React.useEffect(() => {
    scheduleUpdate();
  }, [state.placement, scheduleUpdate]);

  React.useEffect(() => {
    if (!popperInstanceRef.current) return;

    popperInstanceRef.current.setOptions({
      placement,
      strategy,
      modifiers: [...modifiers, updateModifier],
    });
    // intentionally NOT re-running on new modifiers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategy, placement, eventsEnabled, updateModifier]);

  React.useLayoutEffect(() => {
    if (!enabled || !referenceElement || !popperElement) {
      return;
    }

    popperInstanceRef.current = createPopper(referenceElement, popperElement, {
      placement,
      strategy,
      modifiers: [...modifiers, updateModifier],
    });

    return () => {
      if (popperInstanceRef.current !== null) {
        popperInstanceRef.current.destroy();
        popperInstanceRef.current = null;

        setState(s => ({
          ...s,
          styles: initialPopperStyles,
          arrowStyles: initialArrowStyles,
        }));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, popperElement, referenceElement]);

  return state;
};

export default usePopper;
