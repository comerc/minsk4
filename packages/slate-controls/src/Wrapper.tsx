import styled, { css } from 'styled-components'

export default styled.div`
  max-width: ${({ theme }) => theme.contentWidth};
  ${({ isSelected }) =>
    !isSelected &&
    css`
      .block--focused {
        position: relative;
        background-image: linear-gradient(
          17deg,
          rgba(243, 248, 255, 0.03) 63.45%,
          rgba(207, 214, 229, 0.27) 98%
        );
        border-radius: 4px;
        &:before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 1px;
          bottom: 1px;
          box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryColor5};
          border-radius: 4px;
        }
        &:after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 1px;
          bottom: 1px;
          box-shadow: 0 0 0 1px red;
          border-radius: 4px;
        }
      }
    `}
`
