import React from 'react'
import PropTypes from 'prop-types'
import { bestFacebookLocaleFor } from 'facebook-locales'

let isAccountKitInitialized = false

class AccountKit extends React.Component {
  state = {
    disabled: !isAccountKitInitialized,
  }

  login = () => {
    const { disabled } = this.state
    if (disabled) {
      return
    }
    const { loginType, onLogin, countryCode, phoneNumber, emailAddress } = this.props
    const options = {}
    if (loginType === 'PHONE') {
      if (countryCode) {
        options.countryCode = countryCode
      }
      if (phoneNumber) {
        options.phoneNumber = phoneNumber
      }
    } else if (loginType === 'EMAIL' && emailAddress) {
      options.emailAddress = emailAddress
    }
    window.AccountKit.login(loginType, options, (response) => onLogin(response))
  }

  onLoad = () => {
    window.AccountKit_OnInteractive = () => {
      const { appId, csrf, version, debug, display, redirect } = this.props
      window.AccountKit.init({
        appId,
        state: csrf,
        version,
        debug,
        display,
        redirect,
        fbAppEventsEnabled: false,
      })
      isAccountKitInitialized = true
      this.setState({
        disabled: false,
      })
    }
  }

  componentDidMount() {
    if (window.AccountKit) {
      return
    }
    const { language } = this.props
    const locale = bestFacebookLocaleFor(language)
    const tag = document.createElement('script')
    tag.setAttribute('src', `https://sdk.accountkit.com/${locale}/sdk.js`)
    tag.setAttribute('id', 'account-kit')
    tag.setAttribute('type', 'text/javascript')
    tag.onload = this.onLoad
    document.head.appendChild(tag)
  }

  componentWillUnmount() {
    const tag = document.getElementById('account-kit')
    tag.onload = null
  }

  render() {
    const disabled = this.state.disabled || this.props.disabled
    return this.props.children({
      onClick: () => {
        this.login()
      },
      disabled,
    })
  }
}

AccountKit.propTypes = {
  csrf: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  loginType: PropTypes.oneOf(['PHONE', 'EMAIL']),
  debug: PropTypes.bool,
  disabled: PropTypes.bool,
  display: PropTypes.oneOf(['popup', 'modal']),
  redirect: PropTypes.string,
  language: PropTypes.string,
  countryCode: PropTypes.string,
  phoneNumber: PropTypes.string,
  emailAddress: PropTypes.string,
}

AccountKit.defaultProps = {
  debug: false,
  disabled: false,
  display: 'popup',
  language: 'en',
  loginType: 'PHONE',
}

export default AccountKit
