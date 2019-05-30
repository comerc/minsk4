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
        &:before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 1px;
          bottom: 1px;
          z-index: -1;
          box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryColor5};
        }
      }
    `}
`
