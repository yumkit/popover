import * as React from 'react';

import { DropdownProps } from './types';

const mergeCallbacks = (...callbacks: any) => (...args: any) => {
  callbacks.filter(Boolean).forEach((fn: any) => fn(...args));
};

const closeDelay = 50;

const useTrigger = (props: DropdownProps) => {
  const {
    opened: manuallyOpened,
    hideOnScroll,
    trigger: triggerOption,
    children,
  } = props;

  const [autoOpened, setAutoOpened] = React.useState(false);
  const closeTimeout = React.useRef(null);

  const [trigger, type] = (triggerOption || '').split('-');

  React.useEffect(() => {
    if (hideOnScroll && triggerOption && autoOpened) {
      const listener = () => {
        console.log('scroll');

        setAutoOpened(false);
      };

      document.addEventListener('scroll', listener);

      return () => {
        document.removeEventListener('scroll', listener);
      };
    }
  }, [hideOnScroll, triggerOption, autoOpened]);

  const referenceProps = React.useMemo(() => {
    switch (trigger) {
      case 'click': {
        const onClick = (e: React.MouseEvent) => {
          e.preventDefault();

          setAutoOpened(prevOpened => !prevOpened);
        };

        if (type !== 'autoclose') {
          return {
            onClick: mergeCallbacks(children.props.onClick, onClick),
          };
        }

        const onBlur = (e: React.MouseEvent) => {
          setAutoOpened(false);
        };

        return {
          onClick: mergeCallbacks(children.props.onClick, onClick),
          onBlur: mergeCallbacks(children.props.onBlur, onBlur),
          tabindex: 0,
        };
      }

      case 'hover': {
        const onMouseEnter = () => {
          setAutoOpened(true);

          clearTimeout(closeTimeout.current);
          closeTimeout.current = null;
        };

        const onMouseLeave = () => {
          closeTimeout.current = setTimeout(() => {
            setAutoOpened(false);
          }, closeDelay);
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

      default:
        return {};
    }
  }, [
    trigger,
    type,
    children.props.onClick,
    children.props.onBlur,
    children.props.onMouseEnter,
    children.props.onMouseLeave,
  ]);

  const contentProps = React.useMemo(() => {
    switch (trigger) {
      case 'click': {
        if (type === 'autoclose') {
          const onMouseDown = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
          };

          return {
            onMouseDown,
          };
        }

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
  }, [trigger, type]);

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
  };
};

export default useTrigger;
