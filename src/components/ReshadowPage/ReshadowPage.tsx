import React from 'react'
import styled, { css } from 'reshadow/macro'

const styles = css`
  container {
    border: 1px solid red;
  }
`

class ReshadowPage extends React.Component<any> {
  render() {
    return styled(styles)`
      container {
        border: 1px solid green;
      }
    `(<container>Dummy</container>)
  }
}

export default ReshadowPage
