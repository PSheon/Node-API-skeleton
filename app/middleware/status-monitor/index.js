const validate = require('./helpers/validate')
const socketIoInit = require('./helpers/socket-io-init')

const middlewareWrapper = (config) => {
  const validatedConfig = validate(config)

  const middleware = (req, res, next) => {
    socketIoInit(req.socket.server, validatedConfig)
    next()
  }

  middleware.middleware = middleware

  return middleware
}

module.exports = middlewareWrapper
