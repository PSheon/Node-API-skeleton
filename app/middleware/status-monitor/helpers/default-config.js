module.exports = {
  path: '/',
  socketPath: '/socket.io',
  spans: [
    {
      interval: 1,
      retention: 60
    },
    {
      interval: 5,
      retention: 60
    },
    {
      interval: 15,
      retention: 60
    }
  ],
  port: null,
  websocket: null,
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    heap: true,
    eventLoop: true,
    responseTime: true,
    rps: true,
    statusCodes: true
  },
  ignoreStartsWith: '/admin',
  healthChecks: [],
  healthChecksInterval: 300
}
