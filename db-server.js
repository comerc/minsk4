const jsonServer = require('json-server')
const server = jsonServer.create()

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

// // Add custom routes before JSON Server router
// server.get('/echo', (req, res) => {
//   res.jsonp(req.query)
// })

// // To handle POST, PUT and PATCH you need to use a body-parser
// // You can use the one used by JSON Server
// server.use(jsonServer.bodyParser)
// server.use((req, res, next) => {
//   if (req.method === 'POST') {
//     req.body.createdAt = Date.now()
//   }
//   // Continue to JSON Server router
//   next()
// })

// Add custom middleware
server.get('/posts', (req, _, next) => {
  req.query.isDeleted = 'false'
  next()
})

// Use default router
const path = require('path')
const createData = require(path.join(__dirname, 'db-data'))
const router = jsonServer.router(createData())
server.use(router)

server.listen(4000, () => {
  console.log('JSON Server is running')
})
