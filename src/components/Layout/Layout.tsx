import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { matchRoutes, renderRoutes } from 'react-router-config'
import NotFound from './NotFound'
import Header from './Header'
import Footer from './Footer'

const withStyle = (Self) => styled(Self)``

@withStyle
class Layout extends React.Component<any> {
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

  state = { pathname: null, isNotFound: false }

  render() {
    const {
      className,
      route: { routes },
    } = this.props
    const { isNotFound } = this.state
    return (
      <div className={className}>
        {isNotFound && <NotFound />}
        {isNotFound || (
          <React.Fragment>
            <Header />
            {renderRoutes(routes)}
            <Footer />
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default Layout
