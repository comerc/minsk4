const config = require('./config')
const rp = require('request-promise')
const crypto = require('crypto-js')

const ACCOUNT_KIT_APP_ID = config.get('REACT_APP_ACCOUNT_KIT_APP_ID')
const REACT_APP_ACCOUNT_KIT_SECRET = config.get('REACT_APP_ACCOUNT_KIT_SECRET')
const baseUrl = `https://graph.accountkit.com/${config.get('REACT_APP_ACCOUNT_KIT_VERSION')}`

const result = {
  accessToken: (code) =>
    rp({
      uri: `${baseUrl}/access_token`,
      qs: {
        grant_type: 'authorization_code',
        code,
        access_token: ['AA', ACCOUNT_KIT_APP_ID, REACT_APP_ACCOUNT_KIT_SECRET].join('|'),
      },
      json: true,
    }),
  me: (accessToken) =>
    rp({
      uri: `${baseUrl}/me`,
      qs: {
        access_token: accessToken,
        appsecret_proof: '' + crypto.HmacSHA256(accessToken, REACT_APP_ACCOUNT_KIT_SECRET), // force into string
      },
      json: true,
    }),
  logout: (accessToken) =>
    rp({
      uri: `${baseUrl}/logout`,
      qs: {
        access_token: accessToken,
        appsecret_proof: '' + crypto.HmacSHA256(accessToken, REACT_APP_ACCOUNT_KIT_SECRET), // force into string,
      },
      json: true,
    }),
  invalidateAllTokens: (accountId) =>
    rp({
      uri: `${baseUrl}/${accountId}/invalidate_all_tokens`,
      qs: {
        access_token: ['AA', ACCOUNT_KIT_APP_ID, REACT_APP_ACCOUNT_KIT_SECRET].join('|'),
      },
      json: true,
    }),
}

module.exports = result
