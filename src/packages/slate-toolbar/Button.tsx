import styled from 'styled-components'
import { Button } from 'antd'

export default styled(Button)`
  &.ant-btn {
    width: ${({ theme }) => theme.toolbarButtonWidth};
    display: inline-flex;
    justify-content: center;
    align-items: center;
    svg {
      fill: currentColor;
      pointer-events: none;
    }
  }
  &.ant-btn.ant-btn-circle {
    width: ${({ theme }) => theme.toolbarButtonHeight};
  }
`
