import { createGlobalStyle } from 'styled-components'

export const theme = {
  mobile: '(max-width: 650px)',
  notMobile: '(min-width: 651px)',
  /**
   * Block content width
   * Should be set in a constant at the modules/ui.js
   */
  contentWidth: '650px',
  /**
   * Toolbar buttons height and width
   */
  toolboxButtonsSize: '34px',
  /**
   * All gray texts: placeholders, settings
   */
  grayText: '#707684',
  /**
   * Blue icons
   */
  colorActiveIcon: '#388AE5',
}

const GlobalStyle = createGlobalStyle``

export default GlobalStyle
