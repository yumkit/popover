import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import Dropdown, { DropdownProps } from '../Dropdown';

afterEach(cleanup);

describe('<Dropdown />', () => {
  const ids = {
    wrapper: 'dropdown-wrapper',
    content: 'dropdown-content',
    reference: 'dropdown-reference',
  };

  const defaultRenderDropdown: DropdownProps['renderDropdown'] = ({
    content,
    state,
  }) => {
    if (state === 'closed') return null;

    return <div data-testid={ids.wrapper}>{content}</div>;
  };

  const defaultRenderContent = () => (
    <div data-testid={ids.content}>Content</div>
  );

  test('renders reference', () => {
    const { getByTestId } = render(
      <Dropdown
        isOpened
        renderDropdown={defaultRenderDropdown}
        renderContent={defaultRenderContent}
      >
        <div data-testid={ids.reference}>Reference</div>
      </Dropdown>
    );

    expect(getByTestId(ids.reference).textContent).toBe('Reference');
  });

  test('renders dropdown with content', () => {
    const { getByTestId } = render(
      <Dropdown
        isOpened
        renderDropdown={defaultRenderDropdown}
        renderContent={defaultRenderContent}
      >
        <div data-testid={ids.reference}>Reference</div>
      </Dropdown>
    );

    expect(getByTestId(ids.wrapper).textContent).toBe('Content');
    expect(getByTestId(ids.content).textContent).toBe('Content');
  });

  test('renders inside portal', () => {
    const portalTarget = document.createElement('div');

    document.body.appendChild(portalTarget);

    render(
      <Dropdown
        isOpened
        renderDropdown={defaultRenderDropdown}
        renderContent={defaultRenderContent}
        usePortal
        portalTarget={portalTarget}
      >
        <div data-testid={ids.reference}>Reference</div>
      </Dropdown>
    );

    expect(portalTarget.textContent).toBe('Content');
  });

  test('runs the dropdown lifecycle', () => {
    const renderDropdown = jest.fn(() => null);

    const { rerender } = render(
      <Dropdown
        isOpened
        renderDropdown={renderDropdown}
        renderContent={defaultRenderContent}
      >
        <div data-testid={ids.reference}>Reference</div>
      </Dropdown>
    );

    expect(renderDropdown.mock.calls.length).toBe(2);

    // First dropdown should calculate the placement
    // @ts-ignore
    expect(renderDropdown.mock.calls[0][0].state).toBe('calculating');
    // Then it should render in the opened state
    // @ts-ignore
    expect(renderDropdown.mock.calls[1][0].state).toBe('opened');

    rerender(
      <Dropdown
        isOpened={false}
        renderDropdown={renderDropdown}
        renderContent={defaultRenderContent}
      >
        <div data-testid={ids.reference}>Reference</div>
      </Dropdown>
    );

    expect(renderDropdown.mock.calls.length).toBe(3);

    // And then finally render in the closed state
    // @ts-ignore
    expect(renderDropdown.mock.calls[2][0].state).toBe('closed');
  });
});
