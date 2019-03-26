import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import { readPost } from 'src/ducks/post'
import { renderRoutes } from 'react-router-config'

const mapStateToProps = (state) => ({
  item: state.post.item,
})

const style = () => (Self) => styled(Self)`
  border: 2px solid blue;
`

@connect(mapStateToProps)
@style()
class PostLayout extends Component<{ id: number }> {
  state = { isFirstLoaded: false }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props as any
    dispatch(readPost(id)).then(() => this.setState({ isFirstLoaded: true }))
  }

  render() {
    const {
      className,
      route: { routes },
      item,
    } = this.props as any
    const { isFirstLoaded } = this.state
    return (
      <div className={className}>
        {isFirstLoaded || <div>Loading...</div>}
        {isFirstLoaded && renderRoutes(routes, { item })}
      </div>
    )
  }
}

export default PostLayout
