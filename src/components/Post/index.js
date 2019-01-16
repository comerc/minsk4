import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import { readPost } from 'src/ducks/post'
import styled from 'styled-components'

const render = ({ className }) => <div className={className}>Post</div>

const Post = ({ className, id }) => {
  useEffect(() => {
    // dispatch(readPost(id))
  }, [])
  return render({ className })
}

const mapStateToProps = (state) => ({
  items: state.post.items,
})

const ConnectedPost = connect(mapStateToProps)(Post)

export default styled(ConnectedPost)``
