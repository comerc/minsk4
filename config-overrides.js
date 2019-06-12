const path = require('path')
const util = require('util')

const inspect = (data) => {
  throw new Error(util.inspect(data, { depth: Infinity }))
}

const loadPackageJson = (packagePath) => {
  try {
    const fse = require('fs-extra')
    const packageObj = fse.readJsonSync(packagePath)
    return packageObj
  } catch (err) {
    throw err
  }
}

const getWorkspacesPaths = () => {
  const packageObj = loadPackageJson('package.json')
  const workspaces = packageObj.workspaces
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

const rewireAbsolutePath = (config, env) => {
  config.resolve.modules = [...config.resolve.modules, path.resolve('.')]
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

module.exports = (config, env) => {
  const appSrc = path.resolve('src')
  const include = [appSrc, ...getWorkspacesPaths()]
  rewireAbsolutePath(config, env)
  rewirePreRule(() => {
    return {
      include,
    }
  })(config, env)
  rewireAppRule(({ options }) => {
    const plugins = [...options.plugins]
    plugins.push([require.resolve('babel-plugin-idx')])
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
      options: {
        ...options,
        plugins,
      },
      include,
    }
  })(config, env)
  const requireForES6 = require('esm')(module /*, options*/)
  const antdVars = requireForES6(path.resolve('src/theme.js')).antdVars
  rewireLess({
    modifyVars: antdVars,
    javascriptEnabled: true,
    sourceMap: env === 'production',
  })(config, env)
  return config
}
