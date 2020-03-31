import React from 'react';

import YumPopover from '@yumkit/dropdown';

import { Button, Dropdown, SpringRenderer } from '../../../../components';

import { Wrapper } from './styled';

const Popover = () => {
  return (
    <Wrapper>
      <YumPopover
        trigger="click-autoclose"
        offsets={[0, 8]}
        renderDropdown={props => <SpringRenderer {...props} />}
        renderContent={props => <Dropdown {...props}>Content</Dropdown>}
      >
        <Button>Reference</Button>
      </YumPopover>
    </Wrapper>
  );
};

export default Popover;
