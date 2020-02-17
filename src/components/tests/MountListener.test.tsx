import * as React from 'react';
import { render } from '@testing-library/react';
import MountListener from '../MountListener';

describe('<MountListener />', () => {
  test('fires callbacks on mount and unmount', () => {
    const onMount = jest.fn(() => null);
    const onUnmount = jest.fn(() => null);

    // First render (without placement)
    const { unmount } = render(
      <MountListener onMount={onMount} onUnmount={onUnmount}>
        Sample content
      </MountListener>
    );

    // Check if onMount was called
    expect(onMount.mock.calls.length).toBe(1);

    unmount();

    // Check if onUnmount was called
    expect(onUnmount.mock.calls.length).toBe(1);
  });
});
