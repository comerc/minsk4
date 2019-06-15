import tinycolor from 'tinycolor2'
import colorPalette from './helpers/color-palette'

// analog of less fade()
const fade = (rgb, alpha) => {
  const color = tinycolor(rgb)
  if (!color.isValid()) {
    throw new Error('Invalid value')
  }
  return color.setAlpha(alpha).toRgbString()
}

const mainVars = {
  // mobile: '(max-width: 650px)',
  // notMobile: '(min-width: 651px)',
  contentWidth: '650px',
  toolbarPaddingHorizontal: '40px',
  toolbarButtonWidth: '32px',
  toolbarButtonHeight: (theme) => theme.btnHeightSm,
}

let antdVars = {
  white: '#fff',
  black: '#000',
  red6: '#f5222d',
  blue6: '#1890ff',
  primaryColor: (theme) => theme.blue6,
  errorColor: (theme) => theme.red6,
  textColor: (theme) => fade(theme.black, 0.65),
  textColorSecondary: (theme) => fade(theme.black, 0.45),
  popoverBg: '#fff',
  popoverColor: (theme) => theme.textColor,
  btnHeightSm: '24px',
  primaryColor5: (theme) => colorPalette(theme.primaryColor, 5),
  fontSizeSm: '12px',
}

const theme = new Proxy(
  { ...mainVars, ...antdVars },
  {
    get: (target, name) => {
      const result = target[name]
      if (typeof result === 'function') {
        return result(theme)
      }
      return result
    },
  },
)

const normalizeAntdVars = (antdVars, theme) => {
  const result = {}
  Object.keys(antdVars).forEach((key) => {
    const underscoreCaseKey = key
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase()
    result[`@${underscoreCaseKey}`] = theme[key]
  })
  return result
}

antdVars = normalizeAntdVars(antdVars, theme)

export { antdVars }
export default theme
