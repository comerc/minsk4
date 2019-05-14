import { createGlobalStyle } from 'styled-components'
import theme from 'src/theme'

// console.log(theme)

const GlobalStyle = createGlobalStyle`
  .fixed-antd-tooltip {
    pointer-events: none;
  }
`

export { theme }
export default GlobalStyle
