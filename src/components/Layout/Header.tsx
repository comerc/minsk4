import React, { Component } from 'react'
import { Button } from 'antd'
import AccountKit from 'src/components/AccountKit'
import styled from 'styled-components'
import { ACCOUNT_KIT_APP_ID, ACCOUNT_KIT_VERSION } from 'src/constants'

const style = () => (Self) => styled(Self)``

@style()
class Header extends Component {
  render() {
    const { className } = this.props as any
    return (
      <div className={className}>
        <div>Header</div>
        <AccountKit
          appId={ACCOUNT_KIT_APP_ID}
          version={ACCOUNT_KIT_VERSION}
          onResponse={(resp) => console.log(resp)}
          csrf={'csrf token here!'}
          // language="ru_RU"
          debug={true}
          display="modal"
          loginType="EMAIL"
        >
          {({ onClick, disabled }) => (
            <Button {...{ onClick, disabled }} type="primary">
              Login
            </Button>
          )}
        </AccountKit>
      </div>
    )
  }
}

export default Header
