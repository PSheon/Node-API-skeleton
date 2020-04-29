/* eslint strict: "off", init-declarations: "off" */
const socketIo = require('socket.io')
const auth = require('../../auth')
const User = require('../../../models/user')
const gatherOsMetrics = require('./gather-os-metrics')
const healthChecker = require('./health-checker')
const jwt = require('jsonwebtoken')

let io

const addSocketEvents = (socket, config) => {
  socket.emit('asm_start', config.spans)
  socket.on('asm_change', () => {
    socket.emit('asm_start', config.spans)
  })
}

module.exports = (server, config) => {
  if (io === null || io === undefined) {
    if (config.websocket !== null) {
      io = config.websocket
    } else {
      io = socketIo(server)
    }

    if (config.authorize) {
      io.use((socket, next) => {
        const token = socket.handshake.query.token
        const JWT_TOKEN = auth.decrypt(token)

        jwt.verify(JWT_TOKEN, process.env.JWT_SECRET, (jwtError, payload) => {
          if (jwtError) {
            return next(new Error('[Authentication error] jwt token error.'))
          }

          // eslint-disable-next-line
          User.findById(payload.data._id, (userError, user) => {
            if (userError) {
              return next(new Error('[Authentication error] user not found.'))
            }

            return next()
          })

          return next()
        })
      })
    }

    io.on('connection', (socket) => {
      addSocketEvents(socket, config)
    })

    /* 監控跨度 */
    config.spans.forEach((span) => {
      span.os = []
      span.responses = []
      const interval = setInterval(
        () => gatherOsMetrics(io, span),
        span.interval * 1000
      )
      interval.unref()
    })

    /* API 健康度檢查 */
    if (config.healthChecks.length) {
      healthChecker(config.healthChecks).then((results) => {
        io.emit('asm_health_stats', results)
        const interval = setInterval(() => {
          io.emit('asm_health_stats', results)
        }, config.healthChecksInterval * 1000)
        interval.unref()
      })
    }
  }
}
