import React, { Component } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import Copyright from 'src/components/Copyright'

const style = () => (Self) => styled(Self)`
  ${Copyright} {
  }
`

@style()
class Footer extends Component {
  render() {
    const { className } = _.get(this, 'props')
    return (
      <div className={className}>
        <Copyright />
      </div>
    )
  }
}

export default Footer
