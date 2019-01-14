const rewireAbsolutePath = (config, env) => {
  const path = require('path')
  config.resolve.modules = [path.resolve('.')].concat(config.resolve.modules)
}

const createRewireBabel = (options = {}) => {
  return (config, env) => {
    const oneOf = config.module.rules.find((element) => element.oneOf).oneOf
    const testSource = /\.(js|mjs|jsx|ts|tsx)$/.source
    const babelLoader = oneOf.find((element) => element.test.source === testSource)
    if (babelLoader) {
      const babelLoaderOptions = babelLoader.options || {}
      babelLoader.options = { ...babelLoaderOptions, ...options }
    }
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

    let lessRules
    if (env === 'production') {
      lessRules = {
        test: lessExtension,
        loader: [
          // TODO: originally this part is wrapper in extract-text-webpack-plugin
          //       which we cannot do, so some things like relative publicPath
          //       will not work.
          //       https://github.com/timarney/react-app-rewired/issues/33
          ...cssRules.loader,
          { loader: 'less-loader', options },
        ],
      }
    } else {
      lessRules = {
        test: lessExtension,
        use: [...cssRules.use, { loader: 'less-loader', options }],
      }
    }
    oneOf.unshift(lessRules)
  }
}

module.exports = function override(config, env) {
  rewireAbsolutePath(config, env)
  createRewireBabel({ babelrc: true })(config, env)
  createRewireLess({ javascriptEnabled: true })(config, env)
  return config
}
