import React from 'react'
import ReactDOM from 'react-dom'

const withTimeouts = (Component) => {
  class Wrapper extends React.Component {
    static displayName = `withTimeouts(${Component.name})`
    timeoutIdPool: any[] = []

    timeout = (callback, ms = 0) => {
      this.timeoutIdPool.push(setTimeout(callback, ms))
    }

    componentWillUnmount() {
      this.timeoutIdPool.forEach((timeoutId) => clearTimeout(timeoutId))
    }

    render() {
      return <Component {...{ ...this.props, timeout: this.timeout }} />
    }
  }

  return Wrapper as any
}

export default withTimeouts
