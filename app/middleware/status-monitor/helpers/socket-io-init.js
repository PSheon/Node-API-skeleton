/* eslint strict: "off", init-declarations: "off" */
const socketIo = require('socket.io')
const gatherOsMetrics = require('./gather-os-metrics')
const healthChecker = require('./health-checker')

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

    io.on('connection', (socket) => {
      if (config.authorize) {
        config
          .authorize(socket)
          .then((authorized) => {
            if (!authorized) {
              socket.disconnect('unauthorized')
            } else {
              addSocketEvents(socket, config)
            }
          })
          .catch(() => socket.disconnect('unauthorized'))
      } else {
        addSocketEvents(socket, config)
      }
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
