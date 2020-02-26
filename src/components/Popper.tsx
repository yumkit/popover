import * as React from 'react';

import {
  Modifier,
  ModifierArguments,
  Placement,
  PositioningStrategy,
  State,
} from '@popperjs/core';

import applyStyles from '@popperjs/core/lib/modifiers/applyStyles';
import arrow from '@popperjs/core/lib/modifiers/arrow';
import computeStyles from '@popperjs/core/lib/modifiers/computeStyles';
import eventListeners from '@popperjs/core/lib/modifiers/eventListeners';
import flip from '@popperjs/core/lib/modifiers/flip';
import hide from '@popperjs/core/lib/modifiers/hide';
import popperOffsets from '@popperjs/core/lib/modifiers/popperOffsets';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import { popperGenerator } from '@popperjs/core/lib/popper-base';

const createPopper = popperGenerator({
  defaultModifiers: [
    hide,
    popperOffsets,
    computeStyles,
    eventListeners,
    flip,
    preventOverflow,
    arrow,
  ],
});

const initialPopperStyles: Partial<CSSStyleDeclaration> = {
  position: 'absolute',
  top: '0',
  left: '0',
  opacity: '0',
  pointerEvents: 'none',
};

const initialArrowStyles: Partial<CSSStyleDeclaration> = {};

export interface PopperOptions {
  placement: Placement;
  strategy: PositioningStrategy;
  eventsEnabled: boolean;
  modifiers: Array<Partial<Modifier<any>>>;
}

export interface PopperState {
  placement: Placement;
  scheduleUpdate: () => void;
  outOfBoundaries: boolean;
  style: Partial<CSSStyleDeclaration>;
  arrowStyles: Partial<CSSStyleDeclaration>;
  // state: State;
}

export interface PopperRenderOptions extends PopperState {
  //   ref: React.RefObject<HTMLElement>;
  ref: any;
}

const usePopper = (
  referenceRef: React.RefObject<HTMLElement>,
  options?: PopperOptions
): PopperRenderOptions => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    eventsEnabled = true,
    modifiers: userModifiers = [],
  } = options || {};

  let modifiers = [...userModifiers];

  // This value will store the return value of createPopper
  const popperInstanceRef = React.useRef(null);

  const popperElementRef = React.useRef(null);

  // This callback should be called to trigger popper update
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
    // state: null,
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
          // state: data.state,
        });
      },
    }),
    [scheduleUpdate, setState]
  );

  let eventsModifier = modifiers.find(m => m.name === eventListeners.name);

  if (!eventsModifier && eventsEnabled) {
    eventsModifier = {
      ...eventListeners,
      enabled: true,
    };
    modifiers = [...modifiers, eventsModifier];
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
  }, [
    strategy,
    placement,
    // eventsModifier.enabled,
    updateModifier,
  ]);

  const initPopper = () => {
    const popperElement = popperElementRef.current;
    const referenceElement = referenceRef.current;

    console.log({ referenceElement, popperElement });

    if (!referenceElement || !popperElement) {
      return;
    }

    popperInstanceRef.current = createPopper(referenceElement, popperElement, {
      //   placement,
      //   strategy,
      //   modifiers: [...modifiers, updateModifier],
      modifiers: [updateModifier],
    });
  };

  const destroyPopper = () => {
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

  React.useLayoutEffect(() => {
    initPopper();
    return () => {
      destroyPopper();
    };
    // This is only run once to _create_ the popper
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveRef = (el: HTMLElement) => {
    if (!el || el === popperElementRef.current) return;

    popperElementRef.current = el;

    destroyPopper();

    initPopper();
  };

  return {
    ...state,
    ref: saveRef,
  };
};

interface Props {
  referenceRef: React.RefObject<HTMLElement>;

  render: (options: PopperRenderOptions) => React.ReactElement;
}

const Popper = ({ referenceRef, render }: Props) => {
  const data = usePopper(referenceRef);

  return render(data);
};

export default Popper;
