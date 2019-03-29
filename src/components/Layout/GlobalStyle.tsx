import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  [data-slate-editor='true'] span[contenteditable='false'] {
    float: left;
  }
`

export default GlobalStyle
