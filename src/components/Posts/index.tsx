import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import { readPosts } from 'src/ducks/posts'
import styled from 'styled-components'

const mapStateToProps = (state) => ({
  items: state.posts.items,
  testField: 123,
})

const style = () => (Component) => styled(Component)`
  border: 2px solid blue;
`

@connect(mapStateToProps)
@style()
class Posts extends Component {
  componentDidMount() {
    dispatch(readPosts())
  }

  render() {
    const { className, testField } = _.get(this, 'props')
    return <div className={className}>Posts {testField}</div>
  }
}

export default Posts
