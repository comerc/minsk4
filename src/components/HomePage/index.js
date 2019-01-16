import React, { Component } from 'react'
import styled from 'styled-components'
import Posts from 'src/components/Posts'
import { Switch, Button } from 'antd'

class HomePage extends Component {
  vars = {
    '@primary-color': '#ddddd0',
    '@text-color': '#000000',
    '@text-color-secondary': '#eb2f96',
    '@heading-color': '#ccccdd',
    '@secondary-color': '#0000ff',
    '@layout-header-background': '#9e8989',
    '@btn-primary-bg': '#ccbb00',
    '@bg-color': '#ddddde',
  }

  handleClick = () => {
    window.less
      .modifyVars(this.vars)
      .then(() => {
        console.log('OK')
      })
      .catch((error) => {
        console.error(`Failed to update theme`)
      })
  }

  render() {
    const { className } = this.props
    return (
      <div className={className}>
        <h1>HomePage</h1>
        <div className="logo2">LOGO</div>
        <Posts />
        <Switch checked={true} />
        <Button type="primary" onClick={this.handleClick}>
          Test
        </Button>
      </div>
    )
  }
}

export default styled(HomePage)``
