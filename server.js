require('dotenv-safe').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const app = express()
const i18n = require('i18n')
const path = require('path')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const FileStreamRotator = require('file-stream-rotator')

const setupDirectory = require('./utils/setup-environment-directory')
const setupSocket = require('./utils/setup-socket')
const statusMonitor = require('./app/middleware/status-monitor')
const initMongo = require('./config/mongo')

const Server = require('http').createServer(app)
const Socket = setupSocket({
  server: Server,
  authorize: true
})

// Setup necessary directory
setupDirectory({ baseDirName: __dirname })
// Setup express server port from ENV, default: 3000
app.set('port', process.env.API_PORT || 3000)

// API Status Monitor
if (process.env.ENABLE_STATUS_MONITOR === 'true') {
  app.use(
    statusMonitor({
      websocket: Socket,
      healthChecks: [
        {
          method: 'GET',
          protocol: 'http',
          host: 'localhost',
          port: '3000',
          path: '/api/cities/all'
        }
      ]
    })
  )
}

// API DOCS UI
if (process.env.ENABLE_DOCS_UI === 'true') {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(
      swaggerJsdoc({
        swaggerDefinition: {
          info: {
            title: 'API Skeleton',
            version: '1.0.0',
            description: 'Generate API document with swagger'
          }
        },
        apis: ['./docs/*.yaml']
      })
    )
  )
}

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else if (process.env.ENABLE_LOG_RECORDER === 'true') {
  app.use(
    morgan('combined', {
      stream: FileStreamRotator.getStream({
        date_format: 'YYYYMMDD', // eslint-disable-line
        filename: path.join(path.join(__dirname, 'logs'), 'access-%DATE%.log'),
        frequency: 'daily',
        verbose: false
      })
    })
  )
}

// Redis cache enabled by env variable
if (process.env.USE_REDIS === 'true') {
  const getExpeditiousCache = require('express-expeditious')
  const cache = getExpeditiousCache({
    namespace: 'expresscache',
    defaultTtl: '1 minute',
    engine: require('expeditious-engine-redis')({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    })
  })
  app.use(cache)
}

// for parsing json
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)

// i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true
})
app.use(i18n.init)

// Init all other stuff
app.use(cors())
app.use(passport.initialize())
app.use(compression())
app.use(helmet())
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(require('./app/routes'))
Server.listen(app.get('port'))
// app.listen(app.get('port'))

// Init MongoDB
initMongo()

module.exports = app // for testing
