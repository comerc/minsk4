import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { dispatch } from 'src/store'
import { readPosts } from 'src/ducks/posts'
import { Link } from 'react-router-dom'

const mapStateToProps = (state) => ({
  items: state.posts.items,
})

const withStyle = (Self) => styled(Self)`
  border: 2px solid blue;
`

@connect(mapStateToProps)
@withStyle
class Posts extends React.Component<any> {
  componentDidMount() {
    dispatch(readPosts())
  }

  render() {
    const { className, items } = this.props
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
