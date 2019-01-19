const path = require('path')
const { generateTheme } = require('antd-theme-generator')
const lessJs = require('less')
const fs = require('fs')

const options = {
  stylesDir: path.join(__dirname, './src/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/styles/vars.less'),
  mainLessFile: path.join(__dirname, './src/styles/main.less'),
  themeVariables: [
    '@primary-color',
    '@secondary-color',
    '@text-color',
    '@text-color-secondary',
    '@heading-color',
    '@layout-body-background',
    '@btn-primary-bg',
    '@layout-header-background',
  ],
  indexFileName: 'index.html',
  outputFilePath: path.join(__dirname, './public/color.less'),
}

generateTheme(options)
  .then((generatedLess) => {
    // console.log('Theme generated successfully')
    return lessJs.render(generatedLess, { javascriptEnabled: true })
  })
  .then(({ css }) => {
    console.log('Less rendered successfully')
    return new Promise((resolve, reject) =>
      fs.writeFile('./public/custom-theme.css', css, (error) => {
        if (error) {
          reject(error)
        }
        resolve()
      }),
    )
  })
  .then(() => {
    console.log('File writed successfully')
  })
  .catch((error) => {
    console.log('Error', error)
  })
