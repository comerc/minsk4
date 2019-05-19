import React from 'react'
import ReactDOM from 'react-dom'

const withContainerNode = (Component) => {
  class Wrapper extends React.Component<any> {
    static displayName = `withContainerNode(${Component.name})`
    containerNode: any = null

    componentDidMount() {
      this.containerNode = ReactDOM.findDOMNode(this.props.editor)
    }

    render() {
      return <Component {...{ ...this.props, containerNode: this.containerNode }} />
    }
  }

  return Wrapper as any
}

export default withContainerNode
