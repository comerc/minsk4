import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

const createRootReducer = (history) => {
  return combineReducers({
    router: connectRouter(history),
    // ... // rest of your reducers
  })
}

export default createRootReducer
