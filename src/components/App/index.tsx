import React, { Component } from 'react'
import { createBrowserHistory } from 'history'
import configureStore from 'src/store'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { renderRoutes } from 'react-router-config'
import routes from 'src/routes'

class App extends Component {
  history = createBrowserHistory()
  store = configureStore(this.history)

  render() {
    return (
      <Provider store={this.store}>
        <ConnectedRouter history={this.history}>{renderRoutes(routes)}</ConnectedRouter>
      </Provider>
    )
  }
}

export default App
