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
  .editor-block--focused {
    background-image: linear-gradient(
      17deg,
      rgba(243, 248, 255, 0.03) 63.45%,
      rgba(207, 214, 229, 0.27) 98%
    );
    border-radius: 3px;
  }
`

@withStyle
class Wrapper extends React.Component<any, any> {
  state = {
    toolbarTop: 0,
    visibleSelectionRectOffset: 0,
    isOpenedToolbox: false,
  }

  containerRef = React.createRef() as any
  wrapperRef = React.createRef() as any
  toolboxRef = React.createRef() as any
  plusRef = React.createRef() as any

  handlePlusIconClick = (event) => {
    event.preventDefault()
    console.log('handlePlusIconClick')
    this.setState((prevState) => {
      const { editor } = this.props
      const { isOpenedToolbox } = prevState
      if (isOpenedToolbox) {
        setTimeout(() => editor.focus())
        // } else {
        //   setTimeout(() => this.fakeInputNode.focus())
      }
      return {
        isOpenedToolbox: !isOpenedToolbox,
      }
    })
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.editor.value.focusBlock === null) {
      return false
    }
    return true
  }

  componentDidUpdate(prevProps) {
    const {
      editor: {
        value: { focusBlock, focusText },
      },
    } = this.props
    const { isOpenedToolbox } = this.state
    const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
    if (isOpenedToolbox && !isEmptyParagraph) {
      //   // if (!isEmptyParagraph) {
      this.setState({
        isOpenedToolbox: false,
      })
      //   // }
      return
    }
    if (!isOpenedToolbox) {
      const visibleSelectionRect = getVisibleSelectionRect()
      if (visibleSelectionRect === null) {
        return
      }
      const { containerNode } = this.props
      const { top: containerBoundTop } = this.containerRef.current.getBoundingClientRect()
      const toolbarTop = Math.floor(visibleSelectionRect.top - containerBoundTop)
      const visibleSelectionRectOffset = Math.floor(visibleSelectionRect.height / 2)
      const plusNode = this.plusRef.current
      plusNode.style.transform = `translate3d(0, calc(${visibleSelectionRectOffset}px - 50%), 0)`
      const toolboxNode = this.toolboxRef.current
      toolboxNode.style.transform = `translate3d(0, calc(${visibleSelectionRectOffset}px - 50%), 0)`
      const wrapperNode = this.wrapperRef.current
      wrapperNode.style.transform = `translate3D(0, ${toolbarTop}px, 0)`
      // setTimeout(() => this.setState({ toolbarTop, visibleSelectionRectOffset }))
    }
    // console.log(containerBoundTop)
    // this.plusButtonNode.style.transform = `translate3d(0, calc(${rectOffset}px - 50%), 0)`
    // this.toolboxNode.style.transform = `translate3d(0, calc(${rectOffset}px - 50%), 0)`
    // this.wrapperNode.style.transform = `translate3D(0, ${Math.floor(top)}px, 0)`
  }

  render() {
    const {
      className,
      theme,
      editor: {
        readOnly: isReadOnly,
        value: { focusBlock, focusText },
      },
      children,
    } = this.props
    const { toolbarTop, visibleSelectionRectOffset, isOpenedToolbox } = this.state
    const isTitle = focusBlock.type === 'title'
    const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
    return (
      <div className={className} ref={this.containerRef}>
        <div className="wrapper" ref={this.wrapperRef}>
          <Toolbar
            {...{
              theme,
              toolbarTop,
              visibleSelectionRectOffset,
              isOpenedToolbox,
              isTitle,
              isEmptyParagraph,
              isReadOnly,
              onIconClick: this.handlePlusIconClick,
              toolboxRef: this.toolboxRef,
              plusRef: this.plusRef,
            }}
          />
        </div>
        {children}
      </div>
    )
  }
}

export default Wrapper
