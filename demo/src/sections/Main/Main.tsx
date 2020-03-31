import React from 'react';

import { Wrapper, Title } from './styled';

import { ScrollContainer } from '../../components';

import { Popover } from './components';

const Main = () => {
  const scrollbarRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollbarRef.current) {
      // @ts-ignore
      scrollbarRef.current.view.scrollTop = 250;
      // @ts-ignore
      scrollbarRef.current.view.scrollLeft = 250;
    }
  }, []);

  const saveScrollbarRef = React.useCallback(ref => {
    scrollbarRef.current = ref;
  }, []);

  return (
    <Wrapper>
      <Title>A popover component that does it all</Title>

      <ScrollContainer
        style={{ width: 250, height: 250 }}
        ref={saveScrollbarRef}
      >
        <Popover />
      </ScrollContainer>
    </Wrapper>
  );
};

export default Main;
