import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import {
  loadCSRF,
  loadToken,
  setToken,
  invalidateAllTokens,
  logout,
  doDelete,
} from 'src/ducks/account'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Icon, Modal, Button } from 'antd'
import AccountKit from 'src/components/AccountKit'
import { ACCOUNT_KIT_APP_ID, ACCOUNT_KIT_VERSION } from 'src/constants'

const mapStateToProps = (state) => ({
  isLogged: !!state.account.token,
})

const withStyle = (Self) => styled(Self)``

@connect(mapStateToProps)
@withStyle
class Header extends React.Component<any> {
  csrf = null

  language =
    (window.navigator.languages && window.navigator.languages[0]) ||
    window.navigator.language ||
    AccountKit.defaultProps.language

  handleAccountKitMount = () => {
    return dispatch(loadCSRF()).then(({ csrf, state }) => {
      this.csrf = csrf
      return { state }
    })
  }

  handleAccountKitLogin = ({ status, state, code }) => {
    return dispatch(loadToken({ status, state, code }, this.csrf))
  }

  handleLoginClick = _.memoize((login) => (event) => {
    event.preventDefault()
    login().then(({ token }) => {
      dispatch(setToken(token))
    })
  })

  relogin = (login) => (onLogin) => {
    return new Promise((resolve, reject) => {
      Modal.info({
        title: 'Выполните вход',
        content: 'Для этой операции требуется повторно выполнить вход',
        onOk: () => {
          login()
            .then(onLogin)
            .then(resolve)
            .catch(reject)
        },
      })
    })
  }

  handleLogoutClick = _.memoize((login) => (event) => {
    event.preventDefault()
    Modal.confirm({
      title: 'Выйти на всех устройствах?',
      content: '',
      okText: 'Да',
      cancelText: 'Нет, только здесь',
      onOk: () => {
        dispatch(invalidateAllTokens(this.relogin(login)))
      },
      onCancel: () => {
        dispatch(logout())
      },
    })
  })

  handleDeleteClick = _.memoize((login) => (event) => {
    event.preventDefault()
    Modal.confirm({
      title: 'Удалить аккаунт?',
      content: '',
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        dispatch(doDelete(this.relogin(login)))
      },
    })
  })

  render() {
    const { className, isLogged } = this.props
    return (
      <div className={className}>
        <div>
          <Link to="/">Logo</Link>
        </div>
        <div>
          <Link to="/404">404</Link>
        </div>
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
          {({ login, disabled }) => (
            <React.Fragment>
              {isLogged && (
                <Dropdown
                  {...{
                    overlay: (
                      <Menu>
                        <Menu.Item>
                          <Button type="link" onClick={this.handleLogoutClick(login)}>
                            Logout
                          </Button>
                        </Menu.Item>
                        <Menu.Item>
                          <Button type="link" onClick={this.handleDeleteClick(login)}>
                            Delete
                          </Button>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item>3rd menu item</Menu.Item>
                      </Menu>
                    ),
                    trigger: ['click'],
                    disabled,
                  }}
                >
                  <Button type="primary">
                    Account <Icon type="down" />
                  </Button>
                </Dropdown>
              )}
              {isLogged || (
                <Button {...{ onClick: this.handleLoginClick(login), disabled }} type="primary">
                  Login
                </Button>
              )}
            </React.Fragment>
          )}
        </AccountKit>
      </div>
    )
  }
}

export default Header
