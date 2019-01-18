import React, { Component } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import Post from 'src/components/Post'

const style = () => (Self) => styled(Self)``

@style()
class PostPage extends Component {
  render() {
    const {
      className,
      match: {
        params: { id },
      },
    } = _.get(this, 'props')
    return (
      <div className={className}>
        <Post id={id} />
      </div>
    )
  }
}

export default PostPage
