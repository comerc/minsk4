import React, { Component } from 'react'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import { readPosts } from 'src/ducks/posts'
import styled from 'styled-components'

class Posts extends Component {
  componentDidMount() {
    dispatch(readPosts())
  }

  render() {
    const { className } = this.props
    return <div className={className}>Posts</div>
  }
}

const mapStateToProps = (state) => ({
  items: state.posts.items,
})

const ConnectedPosts = connect(mapStateToProps)(Posts)

export default styled(ConnectedPosts)``
