import React from 'react'
import styled from 'styled-components'
import Editor from 'src/components/Editor'

const withStyle = (Self) => styled(Self)``

@withStyle
class EditorPage extends React.Component {
  render() {
    const { className } = this.props as any
    return (
      <div className={className}>
        <Editor />
      </div>
    )
  }
}

export default EditorPage
