const defaultConfig = require('./default-config')

/* eslint complexity: ["error", 12] */
module.exports = (config) => {
  if (!config) {
    return defaultConfig
  }

  const mungeChartVisibility = (configChartVisibility) => {
    Object.keys(defaultConfig.chartVisibility).forEach((key) => {
      if (configChartVisibility[key] === false) {
        defaultConfig.chartVisibility[key] = false
      }
    })
    return defaultConfig.chartVisibility
  }

  config.path =
    typeof config.path === 'string' ? config.path : defaultConfig.path
  config.socketPath =
    typeof config.socketPath === 'string'
      ? config.socketPath
      : defaultConfig.socketPath
  config.spans =
    typeof config.spans === 'object' ? config.spans : defaultConfig.spans
  config.authorize =
    typeof config.authorize === 'boolean'
      ? config.authorize
      : defaultConfig.authorize
  config.port =
    typeof config.port === 'number' ? config.port : defaultConfig.port
  config.websocket =
    typeof config.websocket === 'object'
      ? config.websocket
      : defaultConfig.websocket
  config.chartVisibility =
    typeof config.chartVisibility === 'object'
      ? mungeChartVisibility(config.chartVisibility)
      : defaultConfig.chartVisibility
  config.ignoreStartsWith =
    typeof config.path === 'string'
      ? config.ignoreStartsWith
      : defaultConfig.ignoreStartsWith

  config.healthChecks = Array.isArray(config.healthChecks)
    ? config.healthChecks
    : defaultConfig.healthChecks
  config.healthChecksInterval =
    typeof config.healthChecksInterval === 'number'
      ? config.healthChecksInterval
      : defaultConfig.healthChecksInterval

  return config
}
