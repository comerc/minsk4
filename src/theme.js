// analog of less fade()
const fade = (rgb, alpha) => {
  if (rgb[0] !== '#' || (rgb.length !== 4 && rgb.length !== 7)) {
    throw new Error('Invalid value')
  }
  const [r, g, b] =
    rgb.length === 4
      ? [
          parseInt(rgb.substring(1, 2), 16),
          parseInt(rgb.substring(2, 3), 16),
          parseInt(rgb.substring(3, 4), 16),
        ]
      : [
          parseInt(rgb.substring(1, 3), 16),
          parseInt(rgb.substring(3, 5), 16),
          parseInt(rgb.substring(5, 7), 16),
        ]
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

let mainVars = {
  // mobile: '(max-width: 650px)',
  // notMobile: '(min-width: 651px)',
  contentWidth: '650px', // Block content width
  toolbarPaddingHorizontal: '40px',
  toolbarButtonWidth: '30px', // Toolbar button width
  toolbarButtonHeight: (theme) => theme.btnHeightSm, // Toolbar button height
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
  btnDefaultBg: '#fff',
  btnHeightSm: '24px',
  // primaryColor5: (theme) => colorPalette(theme.primaryColor, 5),
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

// const normalizeTheme = (theme) => {
//   const result = {}
//   const getSimpleValue = (value) =>
//     typeof value === 'function' ? getSimpleValue(value(theme)) : value
//   Object.entries(theme).forEach(([key, value]) => {
//     result[key] = getSimpleValue(value)
//   })
//   return result
// }

// theme = normalizeTheme({ ...mainVars, ...antdVars })

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
