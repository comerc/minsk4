const config = require('./config')
const rp = require('request-promise')
const crypto = require('crypto-js')

const APP_ID = config.get('REACT_APP_ACCOUNT_KIT_APP_ID')
const SECRET = config.get('REACT_APP_ACCOUNT_KIT_SECRET')
const VERSION = config.get('REACT_APP_ACCOUNT_KIT_VERSION')
const baseUrl = `https://graph.accountkit.com/${VERSION}`

const result = {
  accessToken: (code) =>
    rp({
      uri: `${baseUrl}/access_token`,
      qs: {
        grant_type: 'authorization_code',
        code,
        access_token: ['AA', APP_ID, SECRET].join('|'),
      },
      json: true,
    }),
  me: (accessToken) =>
    rp({
      uri: `${baseUrl}/me`,
      qs: {
        access_token: accessToken,
        appsecret_proof: '' + crypto.HmacSHA256(accessToken, SECRET),
      },
      json: true,
    }),
  logout: (accessToken) =>
    rp({
      method: 'POST',
      uri: `${baseUrl}/logout`,
      qs: {
        access_token: accessToken,
        appsecret_proof: '' + crypto.HmacSHA256(accessToken, SECRET),
      },
      json: true,
    }),
  invalidateAllTokens: (accountId) =>
    rp({
      method: 'POST',
      uri: `${baseUrl}/${accountId}/invalidate_all_tokens`,
      qs: {
        access_token: ['AA', APP_ID, SECRET].join('|'),
      },
      json: true,
    }),
}

module.exports = result
