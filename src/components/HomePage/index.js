import React, { Component } from 'react'
import styled from 'styled-components'
import Posts from 'src/components/Posts'

class HomePage extends Component {
  render() {
    const { className } = this.props
    return (
      <div className={className}>
        <h1>HomePage</h1>
        <Posts />
      </div>
    )
  }
}

export default styled(HomePage)``
