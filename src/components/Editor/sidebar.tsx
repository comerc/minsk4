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
    width: 320px;
    display: none;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 10px;
    margin-left: 6px;
    svg {
      color: Tomato;
    }
  }
  .popup-container.open {
    display: block;
  }
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

      editorRef = (node) => (this.editorNode = node)

      containerRef = (node) => (this.containerNode = node)

      sidebarContainerRef = (node) => (this.sidebarContainerNode = node)

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

      handlePlusIconClick = () => {
        this.setState((prevState) => {
          const { isOpen } = prevState as any
          if (isOpen) {
            setTimeout(() => this.editorNode.focus())
          }
          return {
            isOpen: !isOpen,
          }
        })
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
        return (
          currentLineText.length === 0 &&
          focusBlock.type === 'paragraph' && (
            <div className="sidebar-container" ref={this.sidebarContainerRef}>
              <div>
                <Icon
                  {...{
                    type: 'plus-circle',
                    theme: 'outlined',
                    onClick: this.handlePlusIconClick,
                    className: classNames({ open }),
                  }}
                />
              </div>
              <div className={classNames('popup-container', { open })}>
                {content(this.editorNode)}
              </div>
            </div>
          )
        )
      }

      render() {
        const { className, externalClassName, ...rest } = this.props as any
        return (
          <div className={className} ref={this.containerRef}>
            {this.renderSidebar()}
            <Editor className={externalClassName} {...rest} editorRef={this.editorRef} />
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
