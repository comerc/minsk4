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

let theme = {
  // mobile: '(max-width: 650px)',
  // notMobile: '(min-width: 651px)',
  contentWidth: '650px', // Block content width
  toolboxButtonsSize: '34px', // Toolbar buttons height and width
  moreWidth: '21px', // Toolbar Settings "more" button
}

let antdVars = {
  popoverBg: '#fff',
  black: '#000',
  textColor: (theme) => fade(theme.black, 0.65),
  popoverColor: (theme) => theme.textColor,
  red6: '#f5222d',
  errorColor: (theme) => theme.red6,
  blue6: '#1890ff',
  primaryColor: (theme) => theme.blue6,
}

const normalizeTheme = (theme) => {
  const result = {}
  const getSimpleValue = (value) =>
    typeof value === 'function' ? getSimpleValue(value(theme)) : value
  Object.entries(theme).forEach(([key, value]) => {
    result[key] = getSimpleValue(value)
  })
  return result
}

theme = normalizeTheme({ ...theme, ...antdVars })

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
