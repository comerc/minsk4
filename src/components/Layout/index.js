import React from 'react'
import styled from 'styled-components'
import { renderRoutes } from 'react-router-config'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ className, route: { routes } }) => (
  <div className={className}>
    <Header />
    {renderRoutes(routes)}
    <Footer />
  </div>
)

export default styled(Layout)``
