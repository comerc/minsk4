import styled from 'styled-components'

export const ItemWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  & + & {
    margin-top: 0;
  }
`

export const CheckboxWrapper = styled('span')`
  margin-right: 0.75em;
`

export const ContentWrapper = styled('span')`
  flex: 1;
  opacity: ${(props) => (props.checked ? 0.62 : 1)};
  text-decoration: ${(props) => (props.checked ? 'line-through' : 'none')};
  &:focus {
    outline: none;
  }
`
