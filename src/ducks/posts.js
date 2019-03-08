import { createReducer, createAction } from 'redux-act'
import axios from 'axios'
import { API, PAGE_LIMIT } from 'src/constants'

const NS = 'POSTS__'

const initialState = {
  items: [],
  isLoading: false,
}

const reducer = createReducer({}, initialState)

const readListRequest = createAction(`${NS}READ_LIST_REQUEST`)
reducer.on(readListRequest, (state) => ({
  ...state,
  isLoading: true,
}))

const readListSuccess = createAction(`${NS}READ_LIST_SUCCESS`)
reducer.on(readListSuccess, (state, items) => ({
  ...state,
  items,
  isLoading: false,
}))

const readListFailure = createAction(`${NS}READ_LIST_FAILURE`)
reducer.on(readListFailure, (state) => ({
  ...state,
  isLoading: false,
}))

export const readPosts = () => (dispatch) => {
  dispatch(readListRequest())
  return axios
    .get(`${API}/posts/?_limit=${PAGE_LIMIT}`)
    .then(({ data: items }) => {
      dispatch(readListSuccess(items))
    })
    .catch((error) => {
      dispatch(readListFailure())
      return Promise.reject(error)
    })
}
export default reducer
