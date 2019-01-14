import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import post from './post'
import posts from './posts'

const createRootReducer = (history) => {
  return combineReducers({
    router: connectRouter(history),
    // ... // rest of your reducers
    post,
    posts,
  })
}

export default createRootReducer
