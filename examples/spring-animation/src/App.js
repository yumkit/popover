import React from 'react';

import { css } from 'emotion';
import { useTransition, animated } from 'react-spring';
import Dropdown from '@yumkit/dropdown';

const DropdownComponent = React.forwardRef(
  ({ state, content, placement, style }, ref) => {
    const className = css`
      background: #ffffff;
      box-shadow: 0px 2px 6px rgba(198, 198, 198, 0.5);
      border-radius: 3px;
    `;

    // Render plain div on calculating (no need for transition here)
    if (state === 'calculating') {
      return (
        <div ref={ref} style={style} className={className}>
          {content}
        </div>
      );
    }

    const offset = placement && placement.startsWith('bottom') ? -10 : 10;

    const transitions = useTransition(
      state === 'opened' ? { children: content } : null,
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
              <animated.div className={className} key={key} style={props}>
                {item.children}
              </animated.div>
            )
        )}
      </div>
    );
  }
);

function App() {
  const [opened, setOpened] = React.useState(true);

  const renderContent = () => (
    <div
      className={css`
        padding: 50px;
      `}
    >
      Content
    </div>
  );

  const renderDropdown = dropdownProps => {
    return <DropdownComponent {...dropdownProps} />;
  };

  return (
    <div
      className={css`
        height: 500px;
        font-family: arial;
      `}
    >
      <Dropdown
        isOpened={opened}
        renderDropdown={renderDropdown}
        renderContent={renderContent}
      >
        <button
          className={css`
            background: #307cff;
            border-radius: 4px;
            color: #fff;
            border: none;
            padding: 16px 30px;
            font-weight: 500;
            font-size: 16px;
            outline: none;
            cursor: pointer;
            margin-top: 120px;
          `}
          onClick={() => setOpened(!opened)}
        >
          Click me
        </button>
      </Dropdown>
    </div>
  );
}

export default App;
