import React from 'react'
import styled from 'styled-components'
import Copyright from '../Copyright'

const Footer = ({ className }) => (
  <div className={className}>
    <Copyright className="aaa" />
  </div>
)

export default styled(Footer)`
  ${Copyright} {
  }
`
