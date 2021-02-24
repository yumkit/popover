import { Placement, Modifier } from '@popperjs/core';

import { PopperState } from './usePopper';

export type OffsetArray = [number, number];
export type OffsetFunction = (placement: Placement) => OffsetArray;
export type Offsets = OffsetArray | OffsetFunction;
export type Trigger =
  | 'click'
  | 'click-autoclose'
  | 'hover'
  | 'hover-autoclose'
  | 'focus'
  | 'contextmenu'
  | 'contextmenu-reference';

export interface PopperOptions {
  eventsEnabled?: boolean;
  placement?: Placement;
  modifiers?: Array<Partial<Modifier<any>>>;
}

export interface DropdownOptions {
  placement?: Placement;

  /** The result of renderContent */
  content: React.ReactNode;

  ref: any;

  style: any;

  /** Current dropdown state */
  opened: boolean;
}

export interface ContentRenderOptions
  extends Omit<Omit<PopperState, 'style'>, 'arrowStyles'> {
  props: Record<string, any>;
  arrowProps?: Record<string, any>;

  setOpened?: (opened: boolean) => void;
}

export interface DropdownProps extends PopperOptions {
  /** A reference element */
  children: React.ReactElement;

  /** A function to render dropdown */
  renderDropdown?: (options: DropdownOptions) => any;

  /** A function which allows to customize the initial render */
  renderCalculating?: (options: DropdownOptions) => any;

  /** A function to render content */
  renderContent: (options: ContentRenderOptions) => any;

  /** Is dropdown opened? */
  opened?: boolean;

  /** Automatic dropdown opening trigger */
  trigger?: Trigger;

  /** Hide the popover */
  hideOnScroll?: boolean;

  /** Render dropdown inside a portal? */
  usePortal?: boolean;

  /** Where portal should be mounted */
  portalTarget?: HTMLElement;

  /** An element based on which the popover should flip */
  overflowBoundary?: HTMLElement;

  /** Moves the popover to fit into the viewport while the reference element is visible  */
  tether?: boolean;

  // Custom offsets
  offsets?: Offsets;
}

export { Placement, Modifier };
