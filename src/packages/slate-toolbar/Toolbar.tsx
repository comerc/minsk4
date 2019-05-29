import styled from 'styled-components'

export default styled.div`
  transform: ${({ toolbarTop }) => `translate3d(0, ${toolbarTop}px, 0)`};
`
