import styled, { css } from 'styled-components';

import Tooltip from '@/components/Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
      color: #c53030;
    `}
  ${(props) =>
    props.isFocused &&
    css`
      color: #2158a0;
    border-color: #2158a0;
  `}

  input { width: 100%; flex: 1; border:0; background: transparent;
    padding: 10px 0px;
    border-bottom: 1px solid #111; color:#fff; font-size: 1.5rem;

    &:focus { border-bottom-color: #FF671F; }
  }

  svg {
    margin-right: 7px;
  }
`;

export const Label = styled.label`
  color: #858585;
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 7px;
  svg {
    margin: 0;
  }
  span {
    background: #c53030;
    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
