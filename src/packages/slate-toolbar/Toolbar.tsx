import styled from 'styled-components'

export default styled.div`
  display: inline-flex;
  transform: translate3d(0, ${({ top }) => top}px, 0);
`
