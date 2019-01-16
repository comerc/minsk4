import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import { readPosts } from 'src/ducks/posts'
import styled from 'styled-components'

const render = ({ className }) => <div className={className}>Posts</div>

const Posts = ({ className }) => {
  useEffect(() => {
    // dispatch(readPosts())
  }, [])
  return render({ className })
}

const mapStateToProps = (state) => ({
  items: state.posts.items,
})

const ConnectedPosts = connect(mapStateToProps)(Posts)

export default styled(ConnectedPosts)``
