import React, { Component } from 'react'
import logo from 'src/_logo.svg'
import 'src/_App.css'
import { Button } from 'antd'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  border: 2px solid red;
`

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <StyledButton type="primary">TEST</StyledButton>
      </div>
    )
  }
}

export default App
