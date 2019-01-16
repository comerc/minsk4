import React from 'react'
import styled from 'styled-components'

const Copyright = ({ className }) => (
  <div className={className}>© {new Date().getFullYear()} MyCompany</div>
)

export default styled(Copyright)``
