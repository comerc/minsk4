import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import { readPost } from 'src/ducks/post'
import styled from 'styled-components'

const mapStateToProps = (state) => ({
  items: state.post.items,
})

const style = () => (Component) => styled(Component)`
  border: 2px solid blue;
`

@connect(mapStateToProps)
@style()
class Post extends Component<{ id: number }> {
  componentDidMount() {
    const { id } = _.get(this, 'props')
    dispatch(readPost(id))
  }

  render() {
    const { className, id } = _.get(this, 'props')
    return <div className={className}>Post {id}</div>
  }
}

export default Post
