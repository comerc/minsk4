import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { matchRoutes, renderRoutes } from 'react-router-config'
import NotFound from './NotFound'
import Header from './Header'
import Footer from './Footer'
import GlobalStyle from './GlobalStyle'

const style = () => (Self) => styled(Self)``

@style()
class Layout extends React.Component {
  state = { pathname: null, isNotFound: false }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      location: { pathname },
      route: { routes },
    } = nextProps
    if (pathname !== prevState.pathname) {
      return { pathname, isNotFound: matchRoutes(routes, pathname).length === 0 }
    }
    return null
  }

  render() {
    const {
      className,
      route: { routes },
    } = this.props as any
    const { isNotFound } = this.state
    return (
      <div className={className}>
        {isNotFound && <NotFound />}
        {isNotFound || (
          <React.Fragment>
            <Header />
            {renderRoutes(routes)}
            <Footer />
            <GlobalStyle />
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default Layout
