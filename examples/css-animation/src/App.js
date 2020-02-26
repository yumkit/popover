import React from 'react';

import { css } from 'emotion';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Dropdown from '@yumkit/dropdown';

const offset = 10;
const animationTimeout = 300;
const transitionClassName = 'dropdown';

function App() {
  const [opened, setOpened] = React.useState(true);

  const renderContent = () => {
    return (
      <div
        className={css`
          padding: 50px;
        `}
      >
        Content
      </div>
    );
  };

  const renderDropdown = ({ state, content, placement, style, ref }) => {
    const className = css`
      background: #ffffff;
      box-shadow: 0px 2px 6px rgba(198, 198, 198, 0.5);
      border-radius: 3px;
    `;

    if (state === 'calculating') {
      return (
        <div ref={ref} style={style} className={className}>
          {content}
        </div>
      );
    }

    const verticalPosition = placement.split('-')[0];

    const wrapperClassName = css`
      .${transitionClassName}-enter, .${transitionClassName}-appear {
        opacity: 0;

        &[data-placement*='bottom'] {
          transform: translate3d(0, -${offset}px, 0);
        }
        &[data-placement*='top'] {
          transform: translate3d(0, ${offset}px, 0);
        }
      }

      .${transitionClassName}-enter-active,
        .${transitionClassName}-appear-active {
        opacity: 1;
        transition-duration: ${animationTimeout}ms;
        transition-property: opacity, transform;
        &[data-placement*='bottom'] {
          transform: translate3d(0, 0px, 0);
        }
        &[data-placement*='top'] {
          transform: translate3d(0, 0px, 0);
        }
      }
      .${transitionClassName}-exit {
        opacity: 1;
        &[data-placement*='bottom'] {
          transform: translate3d(0, 0px, 0);
        }
        &[data-placement*='top'] {
          transform: translate3d(0, 0px, 0);
        }
      }
      .${transitionClassName}-exit-active {
        opacity: 0;
        transition-duration: ${animationTimeout}ms;
        transition-property: opacity, transform;

        &[data-placement*='bottom'] {
          transform: translate3d(0, -${offset}px, 0);
        }
        &[data-placement*='top'] {
          transform: translate3d(0, ${offset}px, 0);
        }
      }
    `;

    return (
      <div ref={ref} style={style} className={wrapperClassName}>
        <TransitionGroup component={null}>
          {state === 'opened' && (
            <CSSTransition
              appear
              classNames={transitionClassName}
              timeout={animationTimeout}
            >
              <div className={className} data-placement={verticalPosition}>
                {content}
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
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
          Click me
        </button>
      </Dropdown>
    </div>
  );
}

export default App;
