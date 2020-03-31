import * as React from 'react';

import { Scrollbars, ScrollbarProps } from 'react-custom-scrollbars';

import { Wrapper } from './styled';

interface ScrollContainerProps {
  children: React.ReactNode;

  style?: React.CSSProperties;
}

type Ref = ScrollbarProps['ref'];

const ScrollContainer = React.forwardRef(
  ({ children, ...props }: ScrollContainerProps, ref: Ref) => {
    return (
      // @ts-ignore
      <Wrapper>
        <Scrollbars {...props} autoHide={false} ref={ref}>
          {children}
        </Scrollbars>
      </Wrapper>
    );
  }
);

export default ScrollContainer;
