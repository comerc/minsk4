import styled from 'styled-components'

export default styled.div`
  transform: translate3d(0, ${({ toolbarTop }) => toolbarTop}px, 0);
`
