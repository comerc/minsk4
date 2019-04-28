import React from 'react'
import styled from 'styled-components'

const style = () => (Self) => styled(Self)``

@style()
class AboutPage extends React.Component {
  render() {
    const { className } = this.props as any
    return <div className={className}>AboutPage</div>
  }
}

export default AboutPage
