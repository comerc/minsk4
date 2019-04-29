import React from 'react'
import { ThemeProvider } from 'styled-components'
import { createBrowserHistory } from 'history'
import configureStore from 'src/store'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { renderRoutes } from 'react-router-config'
import routes from 'src/routes'
import GlobalStyle, { theme } from './GlobalStyle'
import './iconsCache'

class App extends React.Component {
  history = createBrowserHistory()
  store = configureStore(this.history)

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Provider store={this.store}>
          <ConnectedRouter history={this.history}>{renderRoutes(routes)}</ConnectedRouter>
          <GlobalStyle />
        </Provider>
      </ThemeProvider>
    )
  }
}

export default App
