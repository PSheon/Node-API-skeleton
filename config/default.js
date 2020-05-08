module.exports = {
  /* API 端口 */
  API_PORT: 3000,

  /* API 密鑰，預設 3 天過期 */
  JWT_SECRET: 'MyUltraSecurePassWordIWontForgetToChange',
  JWT_EXPIRATION_IN_MINUTES: 4320,

  /* API 狀態監控器 */
  ENABLE_STATUS_MONITOR: true,

  /* API 日誌紀錄 */
  ENABLE_LOG_RECORDER: true,

  /* API 文件 UI 窗口 */
  ENABLE_DOCS_UI: true,

  /* Mongo 資料庫位址 */
  MONGO_URI: 'mongodb://localhost:27017/myprojectdbname',

  /* 認證信件設定 */
  EMAIL_FROM_NAME: 'My Project',
  EMAIL_FROM_ADDRESS: 'info@myproject.com',
  EMAIL_SMTP_DOMAIN_MAILGUN: 'myproject.com',
  EMAIL_SMTP_API_MAILGUN: 123456,

  FRONTEND_URL: 'http://localhost:8080',

  /* Redis 快取 */
  ENABLE_REDIS_CACHE: false,
  REDIS_HOST: '127.0.0.1',
  REDIS_PORT: 6379
}
