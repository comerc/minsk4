import React from 'react'
import ReactDOM from 'react-dom'

const withTimeouts = (Component) => {
  class Wrapper extends React.Component<any> {
    static displayName = `withTimeouts(${Component.name})`
    timeoutIdPool: any[] = []

    withTimeout = (callback, ms = 0) => {
      this.timeoutIdPool.push(setTimeout(callback, ms))
    }

    componentWillUnmount() {
      this.timeoutIdPool.forEach((timeoutId) => clearTimeout(timeoutId))
    }

    render() {
      return <Component {...{ ...this.props, withTimeout: this.withTimeout }} />
    }
  }

  return Wrapper as any
}

export default withTimeouts
