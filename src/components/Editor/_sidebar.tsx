import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { Icon, Popover } from 'antd'
import { getVisibleSelectionRect } from 'get-selection-range'

const style = () => (Self) => styled(Self)`
  position: relative;
  .sidebar-container {
    position: absolute;
    display: flex;
    flex-wrap: nowrap;
    z-index: 5;
    i {
      color: #ccc;
      animation: fadeIn 1s;
    }
    i.open {
      animation: spin 1s;
      animation-fill-mode: forwards;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(45deg);
      }
    }
  }
  .popup-container {
    display: none;
    &.open {
      display: block;
    }
    margin-left: 8px;
    svg {
      color: Tomato;
    }
  }
  /* 
  .plus-container {
    display: flex;
    flex-wrap: nowrap;
    cursor: pointer;
  }
  .fake-input {
    margin-left: 6px;
    width: 1px;
    height: 23px;
    outline: none;
  } 
  */
`

const sidebar = (options: any = {}) => {
  let { content = () => '', leftOffset = 0 } = options
  let i = 0
  return (Editor) => {
    @style()
    class Sidebar extends React.Component {
      state = {
        isOpen: false,
      }

      editorNode

      containerNode

      sidebarContainerNode

      // fakeInputNode

      editorRef = (node) => (this.editorNode = node)

      containerRef = (node) => (this.containerNode = node)

      sidebarContainerRef = (node) => (this.sidebarContainerNode = node)

      // fakeInputRef = (node) => (this.fakeInputNode = node)

      componentDidMount() {
        window.addEventListener('scroll', () => this.componentDidUpdate(this.props))
      }

      componentWillUnmount() {
        window.removeEventListener('scroll', () => this.componentDidUpdate(this.props))
      }

      componentDidUpdate(prevProps) {
        const { value } = this.props as any
        const { texts, focusBlock } = value
        const currentTextNode = texts.get(0)
        if (!currentTextNode) {
          return
        }
        const currentLineText = currentTextNode.text
        if (
          (currentLineText.length !== 0 ||
            focusBlock.type !== 'paragraph' ||
            value !== prevProps.value) &&
          this.state.isOpen
        ) {
          this.setState({
            isOpen: false,
          })
          return
        }
        if (this.state.isOpen) {
          return
        }
        const rect = getVisibleSelectionRect()
        if (!rect || !this.sidebarContainerNode || !this.containerNode) {
          return
        }
        const containerBound = this.containerNode.getBoundingClientRect()
        const { top: containerBoundTop } = containerBound
        this.sidebarContainerNode.style.left = `${leftOffset}px`
        const top = rect.top - containerBoundTop - 3
        this.sidebarContainerNode.style.top = `${top}px`
      }

      handlePlusIconClick = (event) => {
        event.preventDefault()
        this.setState((prevState) => {
          const { isOpen } = prevState as any
          if (isOpen) {
            setTimeout(() => this.editorNode.focus())
            // } else {
            //   setTimeout(() => this.fakeInputNode.focus())
          }
          return {
            isOpen: !isOpen,
          }
        })
      }

      handleKeyDown = (event, editor, next) => {
        if (event.key === 'Tab') {
          const { value } = editor
          const { texts, focusBlock } = value
          const currentTextNode = texts.get(0)
          // if (!currentTextNode) {
          //   return next()
          // }
          const currentLineText = currentTextNode.text
          if (
            currentLineText.length === 0 &&
            focusBlock.type === 'paragraph' &&
            !this.state.isOpen
          ) {
            event.preventDefault()
            const plusIcon = document.getElementById('sidebar-plus-icon')
            if (plusIcon) {
              plusIcon.click()
            }
            return
          }
        }
        return next()
      }

      renderSidebar = () => {
        const { value } = this.props as any
        const { isOpen: open } = this.state
        const { texts, focusBlock } = value
        const currentTextNode = texts.get(0)
        if (!currentTextNode) {
          return null
        }
        const currentLineText = currentTextNode.text
        if (currentLineText.length !== 0 || focusBlock.type !== 'paragraph') {
          return null
        }
        return (
          <div className="sidebar-container" ref={this.sidebarContainerRef}>
            {/* <div className="plus-container"> */}
            <div>
              <Icon
                {...{
                  id: 'sidebar-plus-icon',
                  type: 'plus-circle',
                  theme: 'outlined',
                  onClick: this.handlePlusIconClick,
                  className: classNames({ open }),
                }}
              />
            </div>
            {/* <div
                  className="fake-input"
                  ref={this.fakeInputRef}
                  contentEditable={true}
                  onMouseDown={(event) => event.preventDefault()}
                  onTouchStart={(event) => event.preventDefault()}
                  onKeyDown={(event) => console.log(event.key)}
                  tabIndex={-1}
                /> */}
            {/* </div> */}
            <div className={classNames('popup-container', { open })}>
              {content(this.editorNode)}
            </div>
          </div>
        )
      }

      render() {
        const { className, externalClassName, ...rest } = this.props as any
        return (
          <div className={className} ref={this.containerRef}>
            {this.renderSidebar()}
            <Editor
              {...{
                className: externalClassName,
                ...rest,
                editorRef: this.editorRef,
                onKeyDown: this.handleKeyDown,
              }}
            />
          </div>
        )
      }
    }

    return class SidebarDecorator extends React.Component {
      // shouldComponentUpdate(nextProps) {
      //   const { value } = this.props as any
      //   if (value === nextProps.value) {
      //     console.log(false)
      //     return false
      //   }
      //   return true
      // }

      render() {
        const { className, ...rest } = this.props as any
        return <Sidebar {...rest} externalClassName={className} />
      }
    }
  }
}

export default sidebar
