import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Icon, Modal, Button } from 'antd'
import AccountKit from 'src/components/AccountKit'
import { API, ACCOUNT_KIT_APP_ID, ACCOUNT_KIT_VERSION } from 'src/constants'
import styled from 'styled-components'

const style = () => (Self) => styled(Self)``

@style()
class Header extends Component {
  state = {
    isLogged: !!localStorage.getItem('token'),
  }

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
      return Promise.reject()
    }
    if (response.status === 'BAD_PARAMS') {
      console.error('status is BAD_PARAMS')
      return Promise.reject()
    }
    if (response.status !== 'PARTIALLY_AUTHENTICATED') {
      console.error('status is not PARTIALLY_AUTHENTICATED')
      return Promise.reject()
    }
    const { state, code } = response
    const csrf = this.csrf
    return new Promise((resolve, reject) => {
      axios
        .post(`${API}/login`, { csrf, state, code })
        .then(({ data: { token } }) => {
          resolve({ token })
        })
        .catch(reject)
    })
  }

  handleLoginClick = _.memoize((login) => (event) => {
    event.preventDefault()
    login().then(({ token }) => {
      localStorage.setItem('token', token)
      this.setState({ isLogged: true })
    })
  })

  invalidateAllTokens = ({ token }) => {
    axios.post(`${API}/invalidateAllTokens`, { token })
    localStorage.removeItem('token')
    this.setState({ isLogged: false })
  }

  handleLogoutClick = _.memoize((login) => (event) => {
    event.preventDefault()
    Modal.confirm({
      title: 'Выйти на всех устройствах?',
      content: '',
      okText: 'Да',
      cancelText: 'Нет, только здесь',
      onOk: () => {
        const token = localStorage.getItem('token')
        if (!token) {
          this.setState({ isLogged: false })
          return
        }
        const decoded = jwt.decode(token)
        const { exp } = decoded
        const now = new Date().valueOf()
        if (exp * 1000 < now + 1000 * 60 * 60 * 24) {
          Modal.info({
            title: 'Выполните вход',
            content: 'Для этой операции требуется повторно выполнить вход',
            onOk: () => {
              login().then(this.invalidateAllTokens)
            },
          })
          return
        }
        this.invalidateAllTokens({ token })
      },
      onCancel: () => {
        const token = localStorage.getItem('token')
        if (!token) {
          this.setState({ isLogged: false })
          return
        }
        axios.post(`${API}/logout`, { token })
        localStorage.removeItem('token')
        this.setState({ isLogged: false })
      },
    })
  })

  delete = ({ token }) => {
    axios.delete(`${API}/delete`, { data: { token } })
    localStorage.removeItem('token')
    this.setState({ isLogged: false })
  }

  handleDeleteClick = _.memoize((login) => (event) => {
    event.preventDefault()
    Modal.confirm({
      title: 'Удалить аккаунт?',
      content: '',
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        const token = localStorage.getItem('token')
        if (!token) {
          this.setState({ isLogged: false })
          return
        }
        const decoded = jwt.decode(token)
        const { exp } = decoded
        const now = new Date().valueOf()
        if (exp * 1000 < now + 1000 * 60 * 60 * 24) {
          Modal.info({
            title: 'Выполните вход',
            content: 'Для этой операции требуется повторно выполнить вход',
            onOk: () => {
              login().then(this.delete)
            },
          })
          return
        }
        this.delete({ token })
      },
    })
  })

  render() {
    const { className } = this.props as any
    const { isLogged } = this.state
    return (
      <div className={className}>
        <div>Header</div>
        <Link to="/404">404</Link>
        <br />
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
            <Fragment>
              {isLogged && (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item>
                        <a href="#" onClick={this.handleLogoutClick(login)}>
                          Logout
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="#" onClick={this.handleDeleteClick(login)}>
                          Delete
                        </a>
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item>3rd menu item</Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                >
                  <a className="ant-dropdown-link" href="#">
                    Account <Icon type="down" />
                  </a>
                </Dropdown>
              )}
              {isLogged || (
                <Button {...{ onClick: this.handleLoginClick(login), disabled }} type="primary">
                  Login
                </Button>
              )}
            </Fragment>
          )}
        </AccountKit>
      </div>
    )
  }
}

export default Header
