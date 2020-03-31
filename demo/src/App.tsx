import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { Main } from './sections';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: Rubik, arial;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: none;
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyles />

      <Main />
    </>
  );
};

export default App;
