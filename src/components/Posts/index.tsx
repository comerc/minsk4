import React, { Component } from 'react'
import { connect } from 'react-redux'
import { dispatch } from '../../store'
import { readPosts } from '../../ducks/posts'
import styled from 'styled-components'

const mapStateToProps = (state) => ({
  items: state.posts.items,
})

interface Props {
  className: string
}

const style = () => (WrappedComponent) => styled(WrappedComponent)`
  &&.myclass {
    border: 2px solid red;
  }
`

@connect(mapStateToProps)
@style()
class Posts extends Component<Props> {
  componentDidMount() {
    dispatch(readPosts())
  }

  render() {
    return render(this.props)
  }
}

const render = ({ className }: Props) => <div className={className}>Posts</div>

// const Posts = ({ className }) => {
//   useEffect(() => {
//     dispatch(readPosts())
//   }, [])
//   return render({ className })
// }

// const ConnectedPosts = connect(mapStateToProps)(Posts)

export default Posts

//   &&.myclass {
//     border: 2px solid red;
//   }
// `
