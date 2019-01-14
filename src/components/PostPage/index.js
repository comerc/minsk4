import React, { Component } from 'react'
import styled from 'styled-components'
import Post from 'src/components/Post'

class PostPage extends Component {
  render() {
    const {
      className,
      match: {
        params: { id },
      },
    } = this.props
    return (
      <div className={className}>
        <h1>PostPage</h1>
        <Post id={id} />
      </div>
    )
  }
}

export default styled(PostPage)``
