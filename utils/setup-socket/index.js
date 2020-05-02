const socketIo = require('socket.io')
const jwt = require('jsonwebtoken')
const validate = require('./helpers/validate')
const auth = require('../../app/middleware/auth')
const User = require('../../app/models/user')

module.exports = (config) => {
  const validatedConfig = validate(config)
  const io = socketIo(validatedConfig.server)

  if (validatedConfig.authorize) {
    io.use((socket, next) => {
      const token = socket.handshake.query.token
      const JWT_TOKEN = auth.decrypt(token)

      jwt.verify(JWT_TOKEN, process.env.JWT_SECRET, (jwtError, payload) => {
        if (jwtError) {
          return next(
            new Error('[Authentication error] socket jwt token error.')
          )
        }

        // eslint-disable-next-line
        User.findById(payload.data._id, (userError, user) => {
          if (userError) {
            return next(
              new Error('[Authentication error] socket user not found.')
            )
          }

          return next()
        })

        return next()
      })
    })
  }

  return io
}
