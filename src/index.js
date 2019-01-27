import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from 'src/serviceWorker'
import App from 'src/components/App'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

axios
  .post('http://localhost:4000/csrf')
  .then(({ data }) => {
    console.log('post', data)
    return axios.get(`http://localhost:4000/csrf?value=${data.value}`)
  })
  .then(({ data }) => {
    console.log('get', data)
    const { id, value, createdAt } = data[0]
    // if (!value || value != csrf) {
    //   return Promise.reject('Invalid csrf')
    // }
    if (!createdAt || Date.now() - createdAt > 1000 * 60 * 10) {
      return Promise.reject('Expired csrf')
    }
    return axios.delete(`http://localhost:4000/csrf/${id}`)
  })
  .catch((error) => console.log(error))
