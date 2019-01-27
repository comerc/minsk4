import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from 'src/serviceWorker'
import App from 'src/components/App'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

const axios = require('axios')

axios
  .post('http://localhost:4000/csrf')
  .then((response) => {
    console.log('post', response)
    const { token } = response.data
    return axios.get(`http://localhost:4000/csrf?token=${token}`)
  })
  .then((response) => {
    console.log('get', response)
  })
  .catch((error) => console.error(error))
