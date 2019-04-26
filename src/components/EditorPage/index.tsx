import React from 'react'
import styled from 'styled-components'
import Editor from 'src/components/Editor'

const style = () => (Self) => styled(Self)`
  ${Editor} {
    margin: 100px;
    border: 1px solid blue;
  }
`

@style()
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
