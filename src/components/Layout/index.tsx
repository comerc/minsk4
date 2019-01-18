import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { matchRoutes, renderRoutes } from 'react-router-config'
import NotFound from './NotFound'
import Header from './Header'
import Footer from './Footer'

const style = () => (Self) => styled(Self)``

@style()
class Layout extends Component {
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
    } = _.get(this, 'props')
    const { isNotFound } = this.state
    return (
      <div className={className}>
        {isNotFound && <NotFound />}
        {isNotFound || (
          <Fragment>
            <Header />
            {renderRoutes(routes)}
            <Footer />
          </Fragment>
        )}
      </div>
    )
  }
}

export default Layout
