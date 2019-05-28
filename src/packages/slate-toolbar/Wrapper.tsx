import styled from 'styled-components'
import Highlights from './Highlights'
import Toolbar from './Toolbar'
import Plus from './Plus'

export default styled.div`
  max-width: ${({ theme }) => theme.contentWidth};
  ${Highlights} {
    transform: translate3d(100px, 100px, 0);
  }
  ${Toolbar} {
    transform: translate3d(0, ${({ toolbarTop }) => toolbarTop}px, 0);
  }
  ${Plus} {
    transform: translate3d(
      0,
      calc(${({ focusBlockBoundOffset }) => focusBlockBoundOffset}px - 50%),
      0
    );
  }
`
