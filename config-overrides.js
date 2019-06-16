const path = require('path')
const util = require('util')

const inspect = (data) => {
  throw new Error(util.inspect(data, { depth: Infinity }))
}

const getWorkspacesPaths = () => {
  const package = require(path.resolve('package.json'))
  const workspaces = package.workspaces
  const workspacesList = []
  // Normally "workspaces" in package.json is an array
  if (Array.isArray(workspaces)) {
    workspacesList.push(...workspaces)
  }
  // Sometimes "workspaces" in package.json is an object
  // with a ".packages" sub-array, eg: when used with "nohoist"
  // See: https://yarnpkg.com/blog/2018/02/15/nohoist
  if (workspaces && !Array.isArray(workspaces) && Reflect.has(workspaces, 'packages')) {
    workspacesList.push(...workspaces.packages)
  }
  return workspacesList.map((workspace) => path.resolve(workspace))
}

const rewireMainFields = (config, env) => {
  const mainFields = ['main:src', 'browser', 'main']
  config.resolve = { ...config.resolve, mainFields }
}

const rewirePreRule = (getValues) => {
  return (config, env) => {
    const testSource = /\.(js|mjs|jsx|ts|tsx)$/.source
    const rule = config.module.rules.find(
      (element) => element.test && element.test.source === testSource,
    )
    const values = getValues(rule)
    Object.entries(values).forEach(([key, value]) => (rule[key] = value))
  }
}

const rewireAppRule = (getValues) => {
  return (config, env) => {
    const oneOf = config.module.rules.find((element) => element.oneOf).oneOf
    const testSource = /\.(js|mjs|jsx|ts|tsx)$/.source
    const rule = oneOf.find((element) => element.test.source === testSource)
    const values = getValues(rule)
    Object.entries(values).forEach(([key, value]) => (rule[key] = value))
  }
}

const rewireLess = (options = {}) => {
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

const rewireAbsolutePath = (config, env) => {
  config.resolve.modules = [...config.resolve.modules, path.resolve('.')]
}

module.exports = (config, env) => {
  const workspacesPaths = getWorkspacesPaths()
  rewireMainFields(config, env)
  rewirePreRule(({ include }) => {
    return {
      include: [include, ...workspacesPaths],
    }
  })(config, env)
  rewireAppRule(({ options, include }) => {
    const plugins = [...options.plugins]
    // plugins.push([
    //   require.resolve('reshadow/babel'),
    //   {
    //     postcss: true,
    //   },
    // ])
    plugins.push([require.resolve('babel-plugin-idx')])
    plugins.push([
      require.resolve('babel-plugin-import'),
      {
        libraryName: 'antd',
        style: true,
      },
      'import-antd',
    ])
    // TODO: почему-то мало профита от использования (429 B), попробовать babel-plugin-lodash
    // plugins.push([
    //   require.resolve('babel-plugin-import'),
    //   {
    //     libraryName: 'lodash',
    //     libraryDirectory: '',
    //     camel2DashComponentName: false, // default: true
    //   },
    //   'import-lodash',
    // ])
    // if (env === 'development') {
    //   plugins.push([require.resolve('babel-plugin-styled-components')])
    // }
    return {
      options: {
        ...options,
        plugins,
      },
      include: [include, ...workspacesPaths],
    }
  })(config, env)
  const requireForES = require('esm')(module /*, options*/)
  const antdVars = requireForES(path.resolve('src/theme.js')).antdVars
  rewireLess({
    modifyVars: antdVars,
    javascriptEnabled: true,
    sourceMap: env === 'production',
  })(config, env)
  rewireAbsolutePath(config, env)
  return config
}
