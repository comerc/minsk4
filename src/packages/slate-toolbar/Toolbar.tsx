import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import idx from 'idx'
import { Tooltip } from 'antd'
import Button from './Button'
import More from './More'
import { ReactComponent as PlusIcon } from './icons/ce-plus.svg'
import { ReactComponent as MoreIcon } from './icons/outline-more_vert-24px.svg'

const withStyle = (Self) => styled(Self)`
  padding: 0 ${({ theme }) => theme.toolboxButtonsSize};
  svg {
    fill: currentColor;
  }
  .wrapper {
    position: relative;
    margin: 0 auto;
    max-width: ${({ theme }) => theme.contentWidth};
  }
  .editor-block--selected {
    background-image: linear-gradient(
      45deg,
      rgba(243, 248, 255, 0.03) 63.45%,
      rgba(207, 214, 229, 0.27) 98%
    );
    border-radius: 3px;
  }
  .toolbar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    display: none;
    &--opened {
      display: block;
    }
  }
  .content {
    max-width: ${({ theme }) => theme.contentWidth};
    margin: 0 auto;
    position: relative;
  }
  .plus-wrapper {
    position: absolute;
    left: -${({ theme }) => theme.toolboxButtonsSize};
    animation: fadeIn 0.4s;
    display: none;
    &--opened {
      display: block;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
  .plus {
    &--x {
      svg {
        animation: spin 0.4s;
        animation-fill-mode: forwards;
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
  .plus-wrapper,
  .toolbox {
    top: 50%;
    transform: translateY(-50%);
  }
  .more-wrapper {
    position: absolute;
    right: -${({ theme }) => theme.moreWidth};
    top: 0;
    opacity: 0;
    visibility: hidden;
    &--opened {
      opacity: 1;
      visibility: visible;
    }
  }
  .toolbox {
    position: absolute;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.4s ease; /* когда меньше 0.4s, то пропадает MoreIcon, если кликнуть по PlusIcon  */
    /* will-change: opacity; */
    ul {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: row;
      li {
        display: inline;
      }
    }
    &--opened {
      opacity: 1;
      visibility: visible;
    }
  }
`

@withStyle
class Toolbar extends React.Component<any, any> {
  state = {
    isOpenedToolbox: false,
    activeToolId: -1,
  }

  containerRef = React.createRef() as any
  toolbarRef = React.createRef() as any
  toolboxRef = React.createRef() as any
  plusWrapperRef = React.createRef() as any

  move = () => {
    const {
      value: { focusBlock },
    } = this.props
    const containerNode = this.containerRef.current
    const focusBlockNode = containerNode.querySelector(`[data-key="${focusBlock.key}"`)
    const focusBlockBound = focusBlockNode.getBoundingClientRect()
    const { top: containerBoundTop } = containerNode.getBoundingClientRect()
    const toolbarTop = Math.round(focusBlockBound.top - containerBoundTop)
    const focusBlockBoundOffset = Math.round(focusBlockBound.height / 2)
    const plusWrapperNode = this.plusWrapperRef.current
    plusWrapperNode.style.transform = `translate3d(0, calc(${focusBlockBoundOffset}px - 50%), 0)`
    const toolboxNode = this.toolboxRef.current
    toolboxNode.style.transform = `translate3d(0, calc(${focusBlockBoundOffset}px - 50%), 0)`
    const toolbarNode = this.toolbarRef.current
    toolbarNode.style.transform = `translate3D(0, ${toolbarTop}px, 0)`
  }

  focus = () => {
    const {
      value: { selection, document },
    } = this.props
    if (!selection.isFocused) {
      const containerNode = this.containerRef.current
      const documentNode = containerNode.querySelector(`[data-key="${document.key}"`)
      documentNode.focus()
    }
  }

  handleToolClick = (onClick) => (event) => {
    onClick(event)
    this.close()
    this.focus()
  }

  tools = this.props
    .getTools(this.props.editor)
    .map(({ onClick, ...rest }, id) => ({ id, onClick: this.handleToolClick(onClick), ...rest }))

  /**
   * Leaf
   * flip through the toolbox items
   */
  leaf = (isReverseDirection = false) => {
    const { activeToolId } = this.state
    let id = activeToolId
    /**
     * Count index for next Tool
     */
    if (isReverseDirection) {
      /**
       * If activeToolId === -1 then we have no chosen Tool in Toolbox
       */
      if (id === -1) {
        /**
         * Normalize "previous" Tool index depending on direction.
         * We need to do this to highlight "first" Tool correctly
         *
         * Order of Tools: [0] [1] ... [n - 1]
         *   [0 = n] because of: n % n = 0 % n
         *
         * Direction 'right': for [0] the [n - 1] is a previous index
         *   [n - 1] -> [0]
         *
         * Direction 'left': for [n - 1] the [0] is a previous index
         *   [n - 1] <- [0]
         */
        id = 0
      }
      /**
       * If we go left then choose previous (-1) Tool
       * Before counting module we need to add length before because of "The JavaScript Modulo Bug"
       */
      id = (this.tools.length + id - 1) % this.tools.length
    } else {
      /**
       * If we go right then choose next (+1) Tool
       */
      id = (id + 1) % this.tools.length
    }
    this.setState({ activeToolId: id })
  }

  open = () => {
    this.setState({
      isOpenedToolbox: true,
    })
  }

  close = () => {
    this.setState({
      isOpenedToolbox: false,
      activeToolId: -1,
    })
  }

  handleToolbarMouseDown = (event) => {
    /* for stop of double click by PlusIcon or MoreIcon */
    event.preventDefault()
  }

  handlePlusClick = (event) => {
    event.preventDefault()
    if (this.state.isOpenedToolbox) {
      this.close()
    } else {
      this.open()
    }
    this.focus()
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (this.state.isOpenedToolbox) {
        event.preventDefault()
        this.close()
      }
      return
    }
    if (event.key === 'Tab') {
      const {
        value: { selection },
      } = this.props
      if (!selection.isFocused) {
        return
      }
      if (this.state.isOpenedToolbox) {
        event.preventDefault()
        this.leaf(event.shiftKey)
      } else {
        const {
          value: { focusBlock, focusText },
        } = this.props
        const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
        if (isEmptyParagraph) {
          event.preventDefault()
          this.open()
          this.leaf(event.shiftKey)
        }
      }
      return
    }
  }

  handleClick = (event) => {
    if (this.state.isOpenedToolbox) {
      const key = event.target.dataset.key
      const {
        value: { focusBlock, document },
      } = this.props
      if ([focusBlock.key, document.key].includes(key)) {
        this.close()
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.value.focusBlock === null) {
      return false
    }
    return true
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props
    const { focusBlock, focusText } = value
    const isOtherBlock = focusBlock.key !== idx(prevProps, (_) => _.value.focusBlock.key)
    const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
    if (this.state.isOpenedToolbox && (isOtherBlock || !isEmptyParagraph)) {
      this.close()
    }
    if (isOtherBlock) {
      this.move()
    }
  }

  render() {
    const {
      className,
      theme,
      editor,
      editor: { readOnly: isReadOnly },
      value: { focusBlock, focusText },
      children,
    } = this.props
    const { isOpenedToolbox, activeToolId } = this.state
    const isTitle = focusBlock.type === 'title'
    const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
    return (
      <div
        {...{
          className,
          ref: this.containerRef,
          onKeyDown: this.handleKeyDown,
          onClick: this.handleClick,
        }}
      >
        <div className="wrapper">
          {children}
          <div
            {...{
              className: classNames('toolbar', {
                'toolbar--opened': !isReadOnly,
              }),
              ref: this.toolbarRef,
              onMouseDown: this.handleToolbarMouseDown,
            }}
          >
            <div className="content">
              <div
                {...{
                  className: classNames('plus-wrapper', {
                    'plus-wrapper--opened': isEmptyParagraph,
                  }),
                  ref: this.plusWrapperRef,
                }}
              >
                <Button
                  {...{
                    className: classNames('plus', {
                      'plus--x': isOpenedToolbox,
                    }),
                    theme,
                    onClick: this.handlePlusClick,
                  }}
                >
                  <PlusIcon />
                </Button>
              </div>
              <div
                {...{
                  className: classNames('toolbox', { 'toolbox--opened': isOpenedToolbox }),
                  ref: this.toolboxRef,
                }}
              >
                <ul>
                  {this.tools.map(({ id, src, alt, onClick }) => (
                    <li key={id}>
                      <Tooltip
                        {...{
                          title: alt,
                          align: { offset: [0, 3] },
                        }}
                      >
                        <div>
                          <Button
                            {...{
                              isActive: id === activeToolId,
                              theme,
                              onClick,
                            }}
                          >
                            {src}
                          </Button>
                        </div>
                      </Tooltip>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              {...{
                className: classNames('more-wrapper', {
                  'more-wrapper--opened': !isTitle,
                }),
              }}
            >
              <More {...{ theme, editor, onMove: this.move }}>
                <MoreIcon />
              </More>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Toolbar
