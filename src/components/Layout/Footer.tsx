import React from 'react'
import styled from 'styled-components'
import Copyright from 'src/components/Copyright'

const withStyle = (Self) => styled(Self)`
  ${Copyright} {
    margin: 10px;
  }
`

@withStyle
class Footer extends React.Component<any> {
  render() {
    const { className } = this.props
    return (
      <div className={className}>
        <Copyright />
      </div>
    )
  }
}

export default Footer
