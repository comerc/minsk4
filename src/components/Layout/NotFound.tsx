import React, { Component } from 'react'
import _ from 'lodash'
import styled from 'styled-components'

const style = () => (Self) => styled(Self)``

@style()
class NotFound extends Component {
  render() {
    const { className } = _.get(this, 'props')
    return <div className={className}>Not Found</div>
  }
}

export default NotFound
