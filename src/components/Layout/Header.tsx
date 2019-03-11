import React, { Component } from 'react'
import axios from 'axios'
// import jwt from 'jsonwebtoken'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import AccountKit from 'src/components/AccountKit'
import { API, ACCOUNT_KIT_APP_ID, ACCOUNT_KIT_VERSION } from 'src/constants'
import styled from 'styled-components'

const style = () => (Self) => styled(Self)``

@style()
class Header extends Component {
  csrf = null

  language =
    (window.navigator.languages && window.navigator.languages[0]) ||
    window.navigator.language ||
    AccountKit.defaultProps.language

  handleAccountKitMount = () => {
    return axios.post(`${API}/csrf`).then(({ data: { csrf, state } }) => {
      this.csrf = csrf
      return { state }
    })
  }

  handleAccountKitLogin = (response) => {
    if (response.status === 'NOT_AUTHENTICATED') {
      console.error('status is NOT_AUTHENTICATED')
      return
    }
    if (response.status === 'BAD_PARAMS') {
      console.error('status is BAD_PARAMS')
      return
    }
    if (response.status !== 'PARTIALLY_AUTHENTICATED') {
      console.error('status is not PARTIALLY_AUTHENTICATED')
      return
    }
    const { state, code } = response
    const csrf = this.csrf
    axios.post(`${API}/login`, { csrf, state, code }).then((response) => {
      const { token } = response.data
      localStorage.setItem('token', token)
    })
  }

  // refreshToken() {
  //   const token = localStorage.getItem('token')
  //   if (!token) {
  //     return
  //   }
  //   const { iat, refreshInterval, code } = jwt.decode(token)
  //   const expired = iat + refreshInterval
  //   const now = new Date().valueOf() / 1000
  //   if (expired < now) {
  //     axios.post(`${API}/login`, { code }).then((response) => {
  //       const { token } = response.data
  //       console.log({ token })
  //       localStorage.setItem('token', token)
  //     })
  //   }
  // }

  render() {
    const { className } = this.props as any
    return (
      <div className={className}>
        <div>Header</div>
        <AccountKit
          {...{
            appId: ACCOUNT_KIT_APP_ID,
            version: ACCOUNT_KIT_VERSION,
            onMount: this.handleAccountKitMount,
            onLogin: this.handleAccountKitLogin,
            language: this.language,
            debug: process.env.NODE_ENV === 'development',
            loginType: 'EMAIL',
          }}
        >
          {({ onClick, disabled }) => (
            <Button {...{ onClick, disabled }} type="primary">
              Login
            </Button>
          )}
        </AccountKit>
        <Link to="/404">404</Link>
      </div>
    )
  }
}

export default Header
