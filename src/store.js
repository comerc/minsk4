import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import createRootReducer from './ducks'

let store

const configureStore = (history) => {
  const middlewares = [routerMiddleware(history), thunk]
  const enhancers = composeWithDevTools(applyMiddleware(...middlewares))
  store = createStore(createRootReducer(history), compose(enhancers))
  return store
}

const isPromise = (object) => Promise.resolve(object) === object

export const dispatch = (action) => {
  if (isPromise(action)) {
    return store.dispatch(action).catch((error) => {
      if (error) {
        console.error(error)
      }
      return Promise.reject(error)
    })
  }
  return store.dispatch(action)
}

export default configureStore
