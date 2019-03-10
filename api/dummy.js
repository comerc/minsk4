const nanoid = require('nanoid')
const jwt = require('jsonwebtoken')

const token = jwt.sign(
  {
    salt: nanoid(32),
  },
  'SECRET',
  // { expiresIn: `${token_refresh_interval_sec}s` },
  // { expiresIn: `10s` },
)
setTimeout(() => {
  const data = jwt.decode(token)
  // jwt.verify(token, 'SECRET', (error, decoded) => {
  //   console.log({ error, decoded })
  // })

  console.log({ data })

  // console.log(
  //   new Date(data.iat * 1000),
  //   new Date(data.exp * 1000),
  //   data.iat - new Date().valueOf() / 1000,
  // )
}, 0)
