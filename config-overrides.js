const { getLessVars } = require('antd-theme-generator')
const path = require('path')
const util = require('util')

const inspect = (data) => {
  throw new Error(util.inspect(data, { depth: Infinity }))
}

const rewireAbsolutePath = (config, env) => {
  config.resolve.modules = [...config.resolve.modules, path.resolve('.')]
}

const createRewireBabel = (modifyOptions) => {
  return (config, env) => {
    const oneOf = config.module.rules.find((element) => element.oneOf).oneOf
    const testSource = /\.(js|mjs|jsx|ts|tsx)$/.source
    const babelLoader = oneOf.find((element) => element.test.source === testSource)
    babelLoader.options = modifyOptions(babelLoader.options)
  }
}

const createRewireLess = (options = {}) => {
  return (config, env) => {
    const oneOf = config.module.rules.find((element) => element.oneOf).oneOf

    const lessExtension = /\.less$/

    const fileLoader = oneOf.find(
      (element) => element.loader && element.loader.includes('file-loader'),
    )
    fileLoader.exclude.push(lessExtension)

    const testSource = /\.css$/.source
    const cssRules = oneOf.find((element) => element.test.source === testSource)

    const lessRules = {
      test: lessExtension,
      use: [...cssRules.use, { loader: 'less-loader', options }],
    }

    oneOf.unshift(lessRules)
  }
}

module.exports = function override(config, env) {
  rewireAbsolutePath(config, env)
  createRewireBabel((options) => {
    const plugins = [...options.plugins]
    plugins.push([
      require.resolve('babel-plugin-import'),
      {
        libraryName: 'antd',
        style: true,
      },
    ])
    if (env === 'development') {
      plugins.push([require.resolve('babel-plugin-styled-components')])
    }
    return {
      ...options,
      plugins,
    }
  })(config, env)
  createRewireLess({
    // modifyVars: getLessVars(require.resolve('./src/styles/vars.less'))),
    javascriptEnabled: true,
    sourceMap: env === 'production',
  })(config, env)
  return config
}
