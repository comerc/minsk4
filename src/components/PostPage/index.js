import React from 'react'
import styled from 'styled-components'
import Post from 'src/components/Post'

const PostPage = ({
  className,
  match: {
    params: { id },
  },
}) => (
  <div className={className}>
    <h1>PostPage</h1>
    <Post id={id} />
  </div>
)

export default styled(PostPage)``
