import { createReducer, createAction } from 'redux-act'
import axios from 'axios'
import { API_URL } from 'src/constants'

const NS = 'POST__'

const initialState = {
  item: {},
  isLoading: false,
}

const reducer = createReducer({}, initialState)

const readItemRequest = createAction(`${NS}READ_ITEM_REQUEST`)
reducer.on(readItemRequest, (state) => ({
  ...state,
  isLoading: true,
}))

const readItemSuccess = createAction(`${NS}READ_ITEM_SUCCESS`)
reducer.on(readItemSuccess, (state, item) => ({
  ...state,
  item,
  isLoading: false,
}))

const readItemFailure = createAction(`${NS}READ_ITEM_FAILURE`)
reducer.on(readItemFailure, (state) => ({
  ...state,
  isLoading: false,
}))

export const readPost = (id) => (dispatch) => {
  dispatch(readItemRequest())
  return axios
    .get(`${API_URL}/posts/${id}/`)
    .then(({ data: item }) => {
      dispatch(readItemSuccess(item))
    })
    .catch((error) => {
      dispatch(readItemFailure())
      return Promise.reject(error)
    })
}

export default reducer
