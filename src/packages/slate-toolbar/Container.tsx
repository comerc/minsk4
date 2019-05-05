import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { getVisibleSelectionRect } from 'get-selection-range'
import Toolbar from './Toolbar'

const withStyle = (Self) => styled(Self)`
  padding: 0 ${({ theme }) => theme.toolboxButtonsSize};
  .wrapper {
    position: relative;
    margin: 0 auto;
    max-width: ${({ theme }) => theme.contentWidth};
  }
  .editor-block--selected {
    background-image: linear-gradient(
      17deg,
      rgba(243, 248, 255, 0.03) 63.45%,
      rgba(207, 214, 229, 0.27) 98%
    );
    border-radius: 3px;
  }
`

@withStyle
class Container extends React.Component<any, any> {
  state = {
    toolbarTop: 0,
    focusBlockBoundOffset: 0,
    isOpenedToolbox: false,
  }

  containerRef = React.createRef() as any
  toolbarRef = React.createRef() as any
  toolboxRef = React.createRef() as any
  plusButtonRef = React.createRef() as any

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      const { isOpenedToolbox } = this.state
      if (isOpenedToolbox) {
        event.preventDefault()
        const plusButtonNode = this.plusButtonRef.current
        plusButtonNode.click()
      }
    }
    if (event.key === 'Tab') {
      const { isOpenedToolbox } = this.state
      if (isOpenedToolbox) {
        event.preventDefault()
      } else {
        const { value } = this.props
        const { focusBlock, focusText } = value
        const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
        if (isEmptyParagraph) {
          event.preventDefault()
          const plusButtonNode = this.plusButtonRef.current
          plusButtonNode.click()
        }
      }
    }
  }

  handlePlusIconClick = (event) => {
    event.preventDefault()
    this.setState((prevState) => {
      const { isOpenedToolbox } = prevState
      if (isOpenedToolbox) {
        const { editor } = this.props
        setTimeout(() => editor.focus())
      }
      return {
        isOpenedToolbox: !isOpenedToolbox,
      }
    })
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.value.focusBlock === null) {
      return false
    }
    return true
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props
    const { focusBlock } = value
    const { isOpenedToolbox } = this.state
    if (value !== prevProps.value && isOpenedToolbox) {
      this.setState({
        isOpenedToolbox: false,
      })
    }
    if (focusBlock !== prevProps.value.focusBlock) {
      const containerNode = this.containerRef.current
      const focusBlockNode = containerNode.querySelector(`[data-key="${focusBlock.key}"`)
      const focusBlockBound = focusBlockNode.getBoundingClientRect()
      const { top: containerBoundTop } = containerNode.getBoundingClientRect()
      const toolbarTop = Math.floor(focusBlockBound.top - containerBoundTop)
      const focusBlockBoundOffset = Math.floor(focusBlockBound.height / 2)
      const plusButtonNode = this.plusButtonRef.current
      plusButtonNode.style.transform = `translate3d(0, calc(${focusBlockBoundOffset}px - 50%), 0)`
      const toolboxNode = this.toolboxRef.current
      toolboxNode.style.transform = `translate3d(0, calc(${focusBlockBoundOffset}px - 50%), 0)`
      const toolbarNode = this.toolbarRef.current
      toolbarNode.style.transform = `translate3D(0, ${toolbarTop}px, 0)`
      // this.setState({ toolbarTop, focusBlockBoundOffset })
    }
  }

  render() {
    const {
      className,
      theme,
      editor: { readOnly: isReadOnly },
      value: { focusBlock, focusText },
      children,
    } = this.props
    const { toolbarTop, focusBlockBoundOffset, isOpenedToolbox } = this.state
    const isTitle = focusBlock.type === 'title'
    const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
    return (
      <div className={className} ref={this.containerRef} onKeyDown={this.handleKeyDown}>
        <div className="wrapper">
          {children}
          <Toolbar
            {...{
              theme,
              toolbarTop,
              focusBlockBoundOffset,
              isOpenedToolbox,
              isTitle,
              isEmptyParagraph,
              isReadOnly,
              onIconClick: this.handlePlusIconClick,
              toolbarRef: this.toolbarRef,
              toolboxRef: this.toolboxRef,
              plusButtonRef: this.plusButtonRef,
            }}
          />
        </div>
      </div>
    )
  }
}

export default Container
