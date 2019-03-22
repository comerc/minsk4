import { createReducer, createAction } from 'redux-act'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { API } from 'src/constants'

const NS = 'ACCOUNT__'

const initialState = {
  token: localStorage.getItem('token'),
}

const reducer = createReducer({}, initialState)

const _setToken = createAction(`${NS}SET_TOKEN`)
reducer.on(_setToken, (state, token) => ({
  ...state,
  token,
}))

export const loadCSRF = () => () => {
  return axios.post(`${API}/csrf`).then(({ data: { csrf, state } }) => {
    return { csrf, state }
  })
}

export const loadToken = ({ status, state, code }, csrf) => () => {
  if (status === 'NOT_AUTHENTICATED') {
    return Promise.reject('status is NOT_AUTHENTICATED')
  }
  if (status === 'BAD_PARAMS') {
    return Promise.reject('status is BAD_PARAMS')
  }
  if (status !== 'PARTIALLY_AUTHENTICATED') {
    return Promise.reject('status is not PARTIALLY_AUTHENTICATED')
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${API}/token`, { csrf, state, code })
      .then(({ data: { token } }) => {
        resolve({ token })
      })
      .catch(reject)
  })
}

export const setToken = (token) => (dispatch) => {
  dispatch(_setToken(token))
  localStorage.setItem('token', token)
  return Promise.resolve()
}

const withCheckOfToken = (token, relogin, execute) => {
  const decoded = jwt.decode(token)
  const { exp } = decoded
  const now = new Date().valueOf()
  if (exp * 1000 < now + 1000 * 60 * 60 * 24) {
    return relogin(({ token }) => {
      return execute(token)
    })
  }
  return execute(token)
}

export const invalidateAllTokens = (relogin) => (dispatch, getState) => {
  const {
    account: { token },
  } = getState()
  return withCheckOfToken(token, relogin, (token) => {
    dispatch(_setToken(null))
    localStorage.removeItem('token')
    return axios.post(`${API}/invalidateAllTokens`, { token })
  })
}

export const logout = () => (dispatch, getState) => {
  const {
    account: { token },
  } = getState()
  dispatch(_setToken(null))
  localStorage.removeItem('token')
  return axios.post(`${API}/logout`, { token })
}

export const doDelete = (relogin) => (dispatch, getState) => {
  const {
    account: { token },
  } = getState()
  return withCheckOfToken(token, relogin, (token) => {
    dispatch(_setToken(null))
    localStorage.removeItem('token')
    return axios.delete(`${API}/delete`, { data: { token } })
  })
}

export default reducer
