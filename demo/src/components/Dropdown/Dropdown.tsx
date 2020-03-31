import React from 'react';

import { ContentRenderOptions } from '@yumkit/popover';

import { Wrapper, Arrow, ArrowShadow, Content } from './styled';

const Dropdown = (dropdownProps: ContentRenderOptions) => {
  const { props, arrowProps, placement, outOfBoundaries } = dropdownProps;

  return (
    <Wrapper {...props} outOfBoundaries={outOfBoundaries}>
      <Arrow {...arrowProps} placement={placement} />

      <ArrowShadow placement={placement} style={arrowProps?.style} />

      <Content>Dropdown content</Content>
    </Wrapper>
  );
};

// Dropdown.whyDidYouRender = true;

export default Dropdown;
