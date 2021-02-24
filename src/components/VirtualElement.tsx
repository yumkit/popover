import * as React from 'react';

interface VirtualElementProps {
  x: number;
  y: number;
}

const VirtualElement = React.memo(
  React.forwardRef((props: VirtualElementProps, ref) => {
    const { x, y } = props;

    React.useImperativeHandle(ref, () => ({
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        top: y,
        right: x,
        bottom: y,
        left: x,
      }),
    }));

    return null;
  })
);

export default VirtualElement;
