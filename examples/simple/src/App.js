import React from 'react';

import { css } from 'emotion';
import Dropdown from '@juissy/dropdown';

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

  const renderDropdown = ({ state, content, style, ref, ...rest }) => {
    console.log(rest);
    return (
      state !== 'closed' && (
        <div
          ref={ref}
          style={style}
          className={css`
            background: #ffffff;
            box-shadow: 0px 2px 6px rgba(198, 198, 198, 0.5);
            border-radius: 3px;
          `}
        >
          {content}
        </div>
      )
    );
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
          Button
        </button>
      </Dropdown>
    </div>
  );
}

export default App;
