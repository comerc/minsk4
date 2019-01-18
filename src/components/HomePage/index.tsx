import React, { Component } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import Posts from 'src/components/Posts'
import { Button } from 'antd'

const style = () => (Self) => styled(Self)``

@style()
class HomePage extends Component {
  render() {
    const { className } = _.get(this, 'props')
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
