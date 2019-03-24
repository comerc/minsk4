import React, { Component } from 'react'
import styled from 'styled-components'

const style = () => (Self) => styled(Self)`
  .text {
    white-space: pre-wrap;
    border: 2px solid red;
  }
`

@style()
class PostPage extends Component {
  render() {
    const {
      className,
      item: { title, text },
    } = this.props as any
    return (
      <div className={className}>
        <h1>{title}</h1>
        <div className="text">{text.replace(/(\n \r)/g, '\n\n')}</div>
      </div>
    )
  }
}

export default PostPage
