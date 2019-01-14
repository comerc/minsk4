import React, { Component } from 'react'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import { readPost } from 'src/ducks/post'
import styled from 'styled-components'

class Post extends Component {
  componentDidMount() {
    const { id } = this.props
    dispatch(readPost(id))
  }

  render() {
    const { className } = this.props
    return <div className={className}>Post</div>
  }
}

const mapStateToProps = (state) => ({
  items: state.post.items,
})

const ConnectedPost = connect(mapStateToProps)(Post)

export default styled(ConnectedPost)``
