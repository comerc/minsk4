const nconf = (module.exports = require('nconf'))
const path = require('path')

nconf
  .file({ format: nconf.formats.ini, file: path.join(__dirname, '../.env.local') })
  .argv()
  .env([
    'SECRET',
    'REACT_APP_ACCOUNT_KIT_APP_ID',
    'REACT_APP_ACCOUNT_KIT_VERSION',
    'REACT_APP_ACCOUNT_KIT_SECRET',
    'REACT_APP_HOST',
  ])
  .defaults({
    REACT_APP_ACCOUNT_KIT_VERSION: 'v1.3',
    REACT_APP_HOST: 'http://localhost:3000',
  })
