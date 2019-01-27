const jsonServer = require('json-server')
const server = jsonServer.create()

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

// Set default middlewares (logger, static, cors and no-cache)
const defaultMiddlewares = jsonServer.defaults({ noCors: true })
server.use(defaultMiddlewares)

// Add custom cors
const cors = require('cors')
const whitelist = ['http://localhost:3000']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
server.use(cors(corsOptions))

// Add custom routes before JSON Server router
server.use('/csrf', (req, _, next) => {
  if (req.method === 'POST' && !req.query.id) {
    const nanoid = require('nanoid')
    req.body = { value: nanoid(), createdAt: Date.now() }
  }
  if (req.method === 'DELETE') {
    req.method = 'PUT'
  }
  next()
})

// Add custom middleware
server.use('/posts', (req, _, next) => {
  if (req.method === 'GET') {
    req.query.isDeleted = 'false'
  }
  if (req.method === 'POST') {
    if (!req.body) {
      req.body = {}
    }
    req.body.isDeleted = false
  }
  if (req.method === 'DELETE') {
    throw new Error('Use PUT method with isDeleted flag instead of DELETE method')
  }
  next()
})

// Use default router
const path = require('path')
// const createData = require(path.join(__dirname, 'db-data'))
// const router = jsonServer.router(createData())
const router = jsonServer.router(path.join(__dirname, 'db-data.json'))
server.use(router)

server.listen(4000, () => {
  console.log('JSON Server is running')
})
