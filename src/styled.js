import styled from 'styled-components'

export default (strings, ...items) => (WrappedComponent) =>
  styled(WrappedComponent)(strings, ...items)
