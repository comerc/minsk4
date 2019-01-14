import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import configureStore from './store'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { renderRoutes } from 'react-router-config'
import routes from './routes'
import * as serviceWorker from './serviceWorker'
import './index.less'

const history = createBrowserHistory()

const store = configureStore(history)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>{renderRoutes(routes)}</ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
