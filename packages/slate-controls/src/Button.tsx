import styled from 'styled-components'
import { Button } from 'antd'

export default styled(Button)`
  &.ant-btn {
    width: ${({ theme }) => theme.toolbarButtonWidth};
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    pointer-events: initial;
    > svg {
      fill: currentColor;
      pointer-events: none;
    }
    > span {
      white-space: nowrap;
    }
  }
  &.ant-btn.ant-btn-circle {
    width: ${({ theme }) => theme.toolbarButtonHeight};
  }
`
