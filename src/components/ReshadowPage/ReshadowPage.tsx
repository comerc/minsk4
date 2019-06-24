import React from 'react'
import styled, { css } from 'reshadow/macro'

const styles = css`
  /* container {
    background: blue;
  } */
`

class ReshadowPage extends React.Component<any, any> {
  state = { b: false }

  handleClick = () => {
    console.log('handleClick')
    this.setState(({ b }) => ({ b: !b }))
  }

  render() {
    const { b } = this.state
    const color = b ? 'red' : 'green'
    const width = b ? 1 : 2
    // FIXED: calc() as workaround for dynamic px variable
    // https://github.com/lttb/reshadow/issues/23
    return styled(styles)`
      container {
        border: calc(${width} * 1px) solid ${color};
      }
    `(
      <container as="button" onClick={this.handleClick}>
        Dummy
      </container>,
    )
  }
}

export default ReshadowPage
