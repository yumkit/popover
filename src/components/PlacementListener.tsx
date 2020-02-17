import * as React from 'react';

import { Placement } from 'popper.js';

interface PlacementListenerProps {
  placement?: Placement;

  children: React.ReactNode;

  onPlacement: (placement: Placement) => void;
}

// A helper component which fires a
// callback once the placement is calculated
const PlacementListener = ({
  placement,
  children,
  onPlacement,
}: PlacementListenerProps): any => {
  React.useLayoutEffect(() => {
    if (placement) {
      onPlacement(placement);
    }
  }, [placement]); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
};

export default PlacementListener;
