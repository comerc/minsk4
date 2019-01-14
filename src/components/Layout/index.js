import React, { Component } from 'react'
import styled from 'styled-components'
import { renderRoutes } from 'react-router-config'
import Header from './Header'
import Footer from './Footer'

class Layout extends Component {
  render() {
    const {
      className,
      route: { routes },
    } = this.props
    return (
      <div className={className}>
        <Header />
        {renderRoutes(routes)}
        <Footer />
      </div>
    )
  }
}

export default styled(Layout)``
