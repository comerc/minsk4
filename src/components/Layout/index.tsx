import React, { Component } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { renderRoutes } from 'react-router-config'
import Header from './Header'
import Footer from './Footer'

const style = () => (Self) => styled(Self)``

@style()
class Layout extends Component {
  render() {
    const {
      className,
      route: { routes },
    } = _.get(this, 'props')
    return (
      <div className={className}>
        <Header />
        {renderRoutes(routes)}
        <Footer />
      </div>
    )
  }
}

export default Layout
