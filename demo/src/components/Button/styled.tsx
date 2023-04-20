import styled from 'styled-components';

export const Wrapper = styled.button`
  background-color: #307cff;
  border-radius: 4px;
  padding: 16px;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  color: #fff;
  user-select: none;

  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0062df;
  }

  &:active {
    background-color: #0049c0;
    transition: none;
  }
`;
