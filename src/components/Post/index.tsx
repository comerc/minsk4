import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import { readPost } from 'src/ducks/post'
import styled from 'styled-components'

const mapStateToProps = (state) => ({
  item: state.post.item,
})

const style = () => (Component) => styled(Component)`
  border: 2px solid blue;
  .text {
    white-space: pre-wrap;
    border: 2px solid red;
  }
`

@connect(mapStateToProps)
@style()
class Post extends Component<{ id: number }> {
  state = { isFirstLoaded: false }

  componentDidMount() {
    const { id } = _.get(this, 'props')
    dispatch(readPost(id)).then(() => this.setState({ isFirstLoaded: true }))
  }

  render() {
    const {
      className,
      item: { title, text },
    } = _.get(this, 'props')
    const { isFirstLoaded } = this.state
    return (
      <div className={className}>
        {isFirstLoaded || <div>Loading...</div>}
        {isFirstLoaded && (
          <Fragment>
            <h1>{title}</h1>
            <div className="text">{text.replace(/(\n \r)/g, '\n\n')}</div>
          </Fragment>
        )}
      </div>
    )
  }
}

export default Post
