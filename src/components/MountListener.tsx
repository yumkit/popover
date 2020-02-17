import * as React from 'react';

interface MountListenerProps {
  onMount?: () => void;
  onUnmount?: () => void;

  children: any;
}

// A helper component which fires a callback on mount and unmount
const MountListener = ({
  onMount,
  onUnmount,
  children,
}: MountListenerProps) => {
  React.useEffect(() => {
    if (onMount) {
      onMount();
    }

    return onUnmount;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
};

export default MountListener;
