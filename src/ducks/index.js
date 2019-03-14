import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import post from './post'
import posts from './posts'
import account from './account'

const createRootReducer = (history) => {
  return combineReducers({
    router: connectRouter(history),
    // ... // rest of your reducers
    post,
    posts,
    account,
  })
}

export default createRootReducer
