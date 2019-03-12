import React, { Component, Fragment } from 'react'
import axios from 'axios'
// import jwt from 'jsonwebtoken'
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
      // const { accountId } = jwt.decode(token)
      // console.log({ accountId }) // 561142874296458
      localStorage.setItem('token', token)
      this.setState({ isLogged: true })
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

  logout = (event) => {
    event.preventDefault()
    Modal.confirm({
      title: 'Выйти на всех устройствах?',
      content: '',
      okText: 'Да',
      cancelText: 'Нет, только здесь',
      onOk: () => {
        const token = localStorage.getItem('token')
        if (!token) {
          return
        }
        axios.post(`${API}/invalidateAllTokens`, { token })
        localStorage.removeItem('token')
        this.setState({ isLogged: false })
      },
      onCancel: () => {
        const token = localStorage.getItem('token')
        if (!token) {
          return
        }
        axios.post(`${API}/logout`, { token })
        localStorage.removeItem('token')
        this.setState({ isLogged: false })
      },
    })
  }

  delete = (event) => {
    event.preventDefault()
    Modal.confirm({
      title: 'Удалить аккаунт?',
      content: '',
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        const token = localStorage.getItem('token')
        if (!token) {
          return
        }
        axios.delete(`${API}/delete`, { data: { token } })
        localStorage.removeItem('token')
        this.setState({ isLogged: false })
      },
    })
  }

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
          {({ onClick, disabled }) => (
            <Fragment>
              {isLogged && (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item>
                        <a href="#" onClick={this.logout}>
                          Logout
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="#" onClick={this.delete}>
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
                <Button {...{ onClick, disabled }} type="primary">
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
