import * as React from 'react';
import { render } from '@testing-library/react';
import PlacementListener from '../PlacementListener';

describe('<PlaceentListener />', () => {
  test('saves placement during updates', () => {
    const onPlacement = jest.fn(() => null);

    // First render (without placement)
    const { rerender } = render(
      <PlacementListener onPlacement={onPlacement}>
        Initial value
      </PlacementListener>
    );

    expect(onPlacement.mock.calls.length).toBe(0);

    // Rerender (still without placement)
    rerender(
      <PlacementListener onPlacement={onPlacement}>
        Changed value
      </PlacementListener>
    );

    expect(onPlacement.mock.calls.length).toBe(0);

    const placement = 'bottom-start';

    // Rerender with placement
    rerender(
      <PlacementListener placement={placement} onPlacement={onPlacement}>
        Changed value
      </PlacementListener>
    );

    expect(onPlacement.mock.calls.length).toBe(1);
    // @ts-ignore
    expect(onPlacement.mock.calls[0][0]).toBe(placement);
  });
});
