import React from 'react'
import styled from 'styled-components'

const withStyle = (Self) => styled(Self)`
  .text {
    white-space: pre-wrap;
    border: 2px solid red;
  }
`

@withStyle
class PostPage extends React.Component<any> {
  render() {
    const {
      className,
      item: { title, text },
    } = this.props
    return (
      <div className={className}>
        <h1>{title}</h1>
        <div className="text">{text.replace(/(\n \r)/g, '\n\n')}</div>
      </div>
    )
  }
}

export default PostPage
