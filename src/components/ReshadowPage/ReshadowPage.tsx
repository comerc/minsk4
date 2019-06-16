import React from 'react'
import styled, { css } from '@reshadow/macro'

const styles = css`
  /* container {
    background: blue;
  } */
`

class ReshadowPage extends React.Component<any> {
  state = { b: false }

  handleClick = () => {
    console.log('handleClick')
    this.setState({ b: !this.state.b })
  }

  render() {
    const { b } = this.state
    const color = b ? 'red' : 'green'
    return styled(styles)`
      container {
        background: ${color};
      }
    `(
      <container as="button" onClick={this.handleClick}>
        Dummy
      </container>,
    )
  }
}

export default ReshadowPage
