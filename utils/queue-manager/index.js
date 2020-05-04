// TODO
const { setQueues } = require('bull-board')

const echoAppQueue = require('./queues/echo-app')

module.exports = () => {
  setQueues([echoAppQueue])
}
