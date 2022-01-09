import * as React from 'react';

import { DropdownProps } from './types';

const mergeCallbacks = (...callbacks: any) => (...args: any) => {
  callbacks.filter(Boolean).forEach((fn: any) => fn(...args));
};

const OPEN_DELAY = 0;
const CLOSE_DELAY = 50;

const useTrigger = (
  props: DropdownProps,
  refs: { referenceElement: any; popperElement: any }
) => {
  const {
    opened: manuallyOpened,
    hideOnScroll,
    trigger: triggerOption,
    closeDelay = CLOSE_DELAY,
    openDelay = OPEN_DELAY,
    children,
  } = props;

  const { referenceElement, popperElement } = refs;

  const [autoOpened, setAutoOpened] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState({ x: 0, y: 0 });
  const openTimeout = React.useRef(null);
  const closeTimeout = React.useRef(null);

  const [trigger, type] = (triggerOption || '').split('-');
  const renderVirtual = trigger === 'contextmenu' && type !== 'reference';

  React.useEffect(() => {
    if (hideOnScroll && triggerOption && autoOpened) {
      const listener = () => {
        setAutoOpened(false);
      };

      document.addEventListener('scroll', listener);

      return () => {
        document.removeEventListener('scroll', listener);
      };
    }
  }, [hideOnScroll, triggerOption, autoOpened]);

  React.useEffect(() => {
    if (trigger === 'contextmenu') {
      const contextMenuListener = (e: MouseEvent) => {
        if (referenceElement && referenceElement.contains(e.target)) {
          e.preventDefault();

          setAutoOpened(true);

          if (renderVirtual) {
            setCursorPosition({
              x: e.pageX,
              y: e.pageY,
            });
          }
        }
      };

      const clickListener = (e: MouseEvent) => {
        if (popperElement && !popperElement.contains(e.target)) {
          setAutoOpened(false);
        }
      };

      document.addEventListener('contextmenu', contextMenuListener);
      document.addEventListener('click', clickListener);

      return () => {
        document.removeEventListener('contextmenu', contextMenuListener);
        document.removeEventListener('click', clickListener);
      };
    }
  }, [popperElement, referenceElement, renderVirtual, trigger]);

  React.useEffect(() => {
    if (trigger === 'click' && type === 'autoclose') {
      const clickListener = (e: MouseEvent) => {
        if (
          popperElement &&
          !popperElement.contains(e.target) &&
          referenceElement &&
          !referenceElement.contains(e.target)
        ) {
          setAutoOpened(false);
        }
      };

      document.addEventListener('click', clickListener);

      return () => {
        document.removeEventListener('click', clickListener);
      };
    }
  });

  const referenceProps = React.useMemo(() => {
    switch (trigger) {
      case 'click': {
        const onClick = (e: React.MouseEvent) => {
          e.preventDefault();

          setAutoOpened(prevOpened => !prevOpened);
        };

        if (type === 'autoclose') {
          return {
            onClick: mergeCallbacks(children.props.onClick, onClick),
            tabIndex: 0,
          };
        }

        return {
          onClick: mergeCallbacks(children.props.onClick, onClick),
        };
      }

      case 'hover': {
        const onMouseEnter = () => {
          openTimeout.current = setTimeout(() => {
            setAutoOpened(true);
          }, openDelay);

          clearTimeout(closeTimeout.current);
          closeTimeout.current = null;
        };

        const onMouseLeave = () => {
          closeTimeout.current = setTimeout(() => {
            setAutoOpened(false);
          }, closeDelay);

          clearTimeout(openTimeout.current);
          openTimeout.current = null;
        };

        return {
          onMouseEnter: mergeCallbacks(
            children.props.onMouseEnter,
            onMouseEnter
          ),
          onMouseLeave: mergeCallbacks(
            children.props.onMouseLeave,
            onMouseLeave
          ),
        };
      }

      case 'focus': {
        const onFocus = () => {
          openTimeout.current = setTimeout(() => {
            setAutoOpened(true);
          }, openDelay);

          clearTimeout(closeTimeout.current);
          closeTimeout.current = null;
        };

        const onBlur = () => {
          closeTimeout.current = setTimeout(() => {
            setAutoOpened(false);
          }, closeDelay);

          clearTimeout(openTimeout.current);
          openTimeout.current = null;
        };

        return {
          onFocus: mergeCallbacks(children.props.onFocus, onFocus),
          onBlur: mergeCallbacks(children.props.onBlur, onBlur),
        };
      }

      default:
        return {};
    }
  }, [
    trigger,
    type,
    closeDelay,
    openDelay,
    children.props.onClick,
    children.props.onBlur,
    children.props.onMouseEnter,
    children.props.onMouseLeave,
    children.props.onFocus,
  ]);

  const contentProps = React.useMemo(() => {
    switch (trigger) {
      case 'click': {
        return {};
      }

      case 'hover': {
        if (type === 'interactive') {
          const onMouseEnter = () => {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
          };

          const onMouseLeave = () => {
            closeTimeout.current = setTimeout(() => {
              setAutoOpened(false);
            }, closeDelay);
          };

          return {
            onMouseEnter,
            onMouseLeave,
          };
        }

        return {};
      }

      default:
        return {};
    }
  }, [trigger, type, closeDelay]);

  const contentOptions = React.useMemo(() => {
    if (trigger) {
      return {
        setOpened: setAutoOpened,
      };
    }

    return {};
  }, [trigger]);

  let isOpened;

  if (triggerOption) {
    isOpened = autoOpened;

    if (manuallyOpened) {
      console.warn(
        'You have provided opened flag along with the trigger, it will be ignored in favor of the trigger state.'
      );
    }
  } else {
    isOpened = manuallyOpened;
  }

  return {
    isOpened,
    referenceProps,
    contentProps,
    contentOptions,
    cursorPosition,
    renderVirtual,
  };
};

export default useTrigger;
