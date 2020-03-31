import styled from 'styled-components';

import { Placement } from '@yumkit/popover';

const getTriangleStyles = (placement: Placement) => {
  const size = 5;
  const color = '#fff';

  let offsetSide;
  let borders;

  if (placement?.startsWith('bottom')) {
    offsetSide = 'top';
    borders = `
        border-left: ${size}px solid transparent;
        border-right: ${size}px solid transparent;
        border-bottom: ${size}px solid ${color};
      `;
  } else if (placement?.startsWith('top')) {
    offsetSide = 'bottom';
    borders = `
        border-left: ${size}px solid transparent;
        border-right: ${size}px solid transparent;
        border-top: ${size}px solid ${color};
      `;
  } else if (placement?.startsWith('right')) {
    offsetSide = 'left';
    borders = `
        border-top: ${size}px solid transparent;
        border-bottom: ${size}px solid transparent;
        border-right: ${size}px solid ${color};
      `;
  } else if (placement?.startsWith('left')) {
    offsetSide = 'right';
    borders = `
        border-top: ${size}px solid transparent;
        border-bottom: ${size}px solid transparent;
        border-left: ${size}px solid ${color};
      `;
  }

  return `
      ${offsetSide}: -${size}px;
  
      position: absolute;
  
      width: 0;
      height: 0;
      content: "";
  
      ${borders}
  `;
};

export const Wrapper = styled.div<{ outOfBoundaries: boolean }>`
  transition: opacity 0.2s ease-in-out;

  ${p =>
    p.outOfBoundaries &&
    `
        opacity: 0 !important;
    `}
`;

export const Arrow = styled.div<{ placement: Placement }>`
  z-index: 2;

  ${p => getTriangleStyles(p.placement)}
`;

export const ArrowShadow = styled.div<{ placement: Placement }>`
  z-index: 0;
  filter: drop-shadow(0px 2px 6px rgba(198, 198, 198, 1));

  ${p => getTriangleStyles(p.placement)}
`;

export const Content = styled.div`
  padding: 4px;
  background: #ffffff;
  box-shadow: 0px 2px 6px rgba(198, 198, 198, 0.5);
  border-radius: 3px;
  position: relative;
  z-index: 1;
`;
