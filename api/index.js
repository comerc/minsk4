const config = require('./config')

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
const REACT_APP_HOST = config.get('REACT_APP_HOST')
const whitelist = [REACT_APP_HOST]
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
const nanoid = require('nanoid')
const SECRET = config.get('SECRET')
const util = require('util')
const jwt = require('jsonwebtoken')

server.post('/csrf', async (_, res) => {
  try {
    const token = await util.promisify(jwt.sign)(
      {
        salt: nanoid(32),
      },
      SECRET,
      // { expiresIn: '1m' },
    )
    res.status(201).jsonp({ token })
  } catch {
    res.status(500).end()
  }
})

// server.get('/csrf', async (req, res) => {
//   const token = req.query.token
//   try {
//     await util.promisify(jwt.verify)(token, SECRET)
//     res.status(205).end()
//   } catch {
//     res.status(403).end()
//   }
// })

const accountKit = require('./accountKit')

server.post('/login', async (req, res) => {
  const { code, token } = req.body
  try {
    await util.promisify(jwt.verify)(token, SECRET)
  } catch {
    res.status(403).end()
  }
  try {
    const { id, access_token, token_refresh_interval_sec } = await accountKit.accessToken(code)
    res.status(201).jsonp({ id, access_token, token_refresh_interval_sec })
  } catch {
    res.status(500).end()
  }
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
const createData = require('./data')
const router = jsonServer.router(createData())
// const router = jsonServer.router(path.join(__dirname, 'data.json'))
server.use(router)

server.listen(5000, () => {
  console.log('JSON Server is running')
})
