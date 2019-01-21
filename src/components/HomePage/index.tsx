import React, { Component } from 'react'
import styled from 'styled-components'
import Posts from 'src/components/Posts'
import { Button } from 'antd'

const style = () => (Self) => styled(Self)``

@style()
class HomePage extends Component {
  render() {
    const { className } = this.props as any
    return (
      <div className={className}>
        <h1>HomePage</h1>
        <Posts />
        <Button type="primary">Test</Button>
      </div>
    )
  }
}

export default HomePage
