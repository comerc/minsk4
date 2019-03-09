import React from 'react'
import PropTypes from 'prop-types'
import { bestFacebookLocaleFor } from 'facebook-locales'

class AccountKit extends React.Component {
  state = {
    disabled: !window.AccountKit_OnInteractive,
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

  componentDidMount() {
    this.props.onMount().then(({ state }) => {
      if (this.isUnmounted || window.AccountKit_OnInteractive) {
        return
      }
      if (!state) {
        throw new Error('state-param must have value')
      }
      // if (state.length > 36) {
      //   throw new Error('state-param must have length <= 36')
      // }
      const { appId, version, debug, display, redirect, language } = this.props
      window.AccountKit_OnInteractive = () => {
        window.AccountKit.init({
          state,
          appId,
          version,
          debug,
          display,
          redirect,
          fbAppEventsEnabled: false,
        })
        this.setState({
          disabled: false,
        })
      }
      const locale = bestFacebookLocaleFor(language)
      const tag = document.createElement('script')
      tag.setAttribute('src', `https://sdk.accountkit.com/${locale}/sdk.js`)
      tag.setAttribute('id', 'account-kit')
      tag.setAttribute('type', 'text/javascript')
      document.head.appendChild(tag)
      this.isAccountKitInitialized = true
    })
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.isAccountKitInitialized) {
      window.AccountKit_OnInteractive = null
    }
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
  appId: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  onMount: PropTypes.func.isRequired,
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
