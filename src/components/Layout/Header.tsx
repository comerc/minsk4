import React, { Component } from 'react'
import nanoid from 'nanoid'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import AccountKit from 'src/components/AccountKit'
import { ACCOUNT_KIT_APP_ID, ACCOUNT_KIT_VERSION } from 'src/constants'
import styled from 'styled-components'

// acceptLanguage.languages(['zh-CN', 'en-US'])
const style = () => (Self) => styled(Self)``

@style()
class Header extends Component {
  csrf = nanoid()

  language =
    (window.navigator.languages && window.navigator.languages[0]) ||
    window.navigator.language ||
    AccountKit.defaultProps.language

  handleLogin = (response) => {
    if (response.state !== this.csrf) {
      console.error('Invalid csrf')
      return
    }
    console.log(response)
  }

  render() {
    const { className } = this.props as any
    return (
      <div className={className}>
        <div>Header</div>
        <AccountKit
          {...{
            appId: ACCOUNT_KIT_APP_ID,
            version: ACCOUNT_KIT_VERSION,
            onLogin: this.handleLogin,
            csrf: this.csrf,
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
