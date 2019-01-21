import React, { Component } from 'react'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import { readPosts } from 'src/ducks/posts'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const mapStateToProps = (state) => ({
  items: state.posts.items,
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
    const { className, items } = this.props as any
    return (
      <div className={className}>
        {items.map(({ id, title, teaser }) => (
          <div key={id}>
            <h3>
              <Link to={`/post/${id}`}>{title}</Link>
            </h3>
            <p>{teaser}</p>
          </div>
        ))}
      </div>
    )
  }
}

export default Posts
