module.exports = () => ({
  path: '/',
  socketPath: '/socket.io',

  /* 時間跨度 */
  // spans: [
  //   {
  //     interval: 1,
  //     retention: 60
  //   },
  //   {
  //     interval: 5,
  //     retention: 60
  //   },
  //   {
  //     interval: 15,
  //     retention: 60
  //   }
  // ],

  /* Socket 實體 */
  // websocket: null,

  /* 顯示資訊 */
  // chartVisibility: {
  //   cpu: true,
  //   mem: true,
  //   load: true,
  //   heap: true,
  //   eventLoop: true,
  //   responseTime: true,
  //   rps: true,
  //   statusCodes: true
  // },

  /* 排除路由 */
  // ignoreStartsWith: '/admin',

  /* API 健康度 */
  healthChecks: [
    {
      method: 'GET',
      protocol: 'http',
      host: 'localhost',
      path: '/api/cities/all',
      port: '3000'
    }
  ]

  /* API 健康度週期，預設 5 分鐘 */
  // healthChecksInterval: 300
})
