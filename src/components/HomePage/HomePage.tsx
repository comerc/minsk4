import React from 'react'
import styled from 'styled-components'
import Posts from 'src/components/Posts'
import { Button } from 'antd'

const withStyle = (Self) => styled(Self)``

@withStyle
class HomePage extends React.Component<any> {
  render() {
    const { className } = this.props
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
