import React, { Component } from 'react'
import styled from 'styled-components'

class Copyright extends Component {
  render() {
    const { className } = this.props
    return <div className={className}>© {new Date().getFullYear()} MyCompany</div>
  }
}

export default styled(Copyright)``
