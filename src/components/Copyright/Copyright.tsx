import React from 'react'
import styled from 'styled-components'

const withStyle = (Self) => styled(Self)`
  border: 1px solid red;
`

@withStyle
class Copyright extends React.Component<any> {
  render() {
    const { className } = this.props
    return <div className={className}>© {new Date().getFullYear()} MyCompany</div>
  }
}

export default Copyright
