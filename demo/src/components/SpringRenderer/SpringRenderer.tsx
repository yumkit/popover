import React from 'react';

import { DropdownOptions } from '@yumkit/popover';

import { useTransition, animated } from 'react-spring';

const SpringRenderer = React.forwardRef<HTMLDivElement, DropdownOptions>(
  ({ content, opened, placement, style }, ref) => {
    const offset = placement && placement.startsWith('bottom') ? -10 : 10;

    const transitions = useTransition(
      opened ? { children: content } : null,
      null,
      {
        from: { opacity: 0, transform: `translate3d(0, ${offset}px, 0)` },
        enter: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        leave: { opacity: 0, transform: `translate3d(0, ${offset}px, 0)` },
        unique: true,
      }
    );

    return (
      <div ref={ref} style={style}>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div key={key} style={props}>
                {item.children}
              </animated.div>
            )
        )}
      </div>
    );
  }
);

export default SpringRenderer;
