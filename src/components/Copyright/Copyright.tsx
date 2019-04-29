import React from 'react'
import styled from 'styled-components'

const withStyle = (Self) => styled(Self)`
  border: 1px solid red;
`

@withStyle
class Copyright extends React.Component {
  render() {
    const { className } = this.props as any
    return <div className={className}>© {new Date().getFullYear()} MyCompany</div>
  }
}

export default Copyright
