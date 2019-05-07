import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import idx from 'idx'
import Button from './Button'
import { ReactComponent as PlusIcon } from './icons/ce-plus.svg'
import { ReactComponent as MoreIcon } from './icons/outline-more_vert-24px.svg'

const withStyle = (Self) => styled(Self)`
  padding: 0 ${({ theme }) => theme.toolboxButtonsSize};
  svg {
    fill: currentColor;
    vertical-align: middle;
    max-height: 100%;
  }
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
  .toolbar {
    /* border: 1px solid red; */
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    /* opacity: 0; */
    /* visibility: hidden; */
    /* transition: opacity 100ms ease; */
    /* will-change: opacity, transform; */
    display: none;
    @media ${({ theme }) => theme.mobile} {
      border: 1px solid green;
      position: fixed;
      bottom: 0;
      top: auto;
      left: 0;
      right: 0;
      z-index: 9;
      height: 50px;
      background: #fff;
      box-shadow: 0 -2px 12px rgba(60, 67, 81, 0.18);
      transform: none !important;
    }
    &--opened {
      display: block;
      @media ${({ theme }) => theme.mobile} {
        display: flex;
      }
    }
  }
  .content {
    max-width: ${({ theme }) => theme.contentWidth};
    margin: 0 auto;
    position: relative;
    @media ${({ theme }) => theme.mobile} {
      display: flex;
      align-content: center;
      margin: 0;
      padding: 0 10px;
      max-width: calc(100% - 70px);
      overflow-x: auto;
    }
  }
  .plus {
    /* border: 1px solid red; */
    position: absolute;
    left: -${({ theme }) => theme.toolboxButtonsSize};
    animation: fadeIn 0.4s;
    &--hidden {
      display: none;
    }
    @media ${({ theme }) => theme.mobile} {
      display: none !important;
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
  .plus-icon {
    &--x {
      animation: spin 0.4s;
      animation-fill-mode: forwards;
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
  .plus,
  .toolbox {
    top: 50%;
    transform: translateY(-50%);
  }
  /**
     * Block actions Zone
     * -------------------------
     */
  .actions {
    /* border: 1px solid orange; */
    position: absolute;
    right: 0;
    top: 0px;
    /* padding-right: 16px; */
    opacity: 0;
    visibility: hidden;
    @media ${({ theme }) => theme.mobile} {
      position: static;
      margin-left: auto;
      display: flex;
      align-items: center;
    }
    &--opened {
      opacity: 1;
      visibility: visible;
    }
  }
  .actions-buttons {
    text-align: right;
  }
  .settings-btn {
    /* display: inline-block; */
    width: 21px;
    height: 21px;
    color: ${({ theme }) => theme.grayText};
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  /**
   * Styles for Narrow mode
   */
  .editor--narrow .plus {
    /* TODO: */
    @media ${({ theme }) => theme.notMobile} {
      left: 5px;
    }
  }
  .toolbox {
    /* border: 1px solid blue; */
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
    @media ${({ theme }) => theme.mobile} {
      position: static;
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      ul {
        align-items: center;
      }
    }
    &--opened {
      opacity: 1;
      visibility: visible;
    }
  }
  .tooltip {
    position: absolute;
    top: 25px;
    padding: 6px 10px;
    border-radius: 5px;
    line-height: 21px;
    opacity: 0;
    background: ${({ theme }) => theme.bgLight};
    box-shadow: 0 10px 12px -9px rgba(26, 39, 54, 0.32), 0 3px 2px -2px rgba(33, 48, 73, 0.05);
    color: #5c6174;
    font-size: 12px;
    text-align: center;
    user-select: none;
    pointer-events: none;
    /* transition: opacity 150ms ease-in, left 0.1s linear; */
    /* will-change: opacity, left; */
    letter-spacing: 0.02em;
    line-height: 1em;
    &-shortcut {
      color: rgba(100, 105, 122, 0.6);
      word-spacing: -2px;
      margin-top: 5px;
    }
    &--shown {
      opacity: 1;
      /* transition-delay: 0.1s, 0s; */
    }
    &::before {
      content: '';
      width: 10px;
      height: 10px;
      position: absolute;
      top: -5px;
      left: 50%;
      margin-left: -5px;
      transform: rotate(-45deg);
      background-color: ${({ theme }) => theme.bgLight};
      z-index: -1;
    }
  }
  /**
   * Styles for Narrow mode
   */
  .editor--narrow .toolbox {
    /* TODO: */
    @media ${({ theme }) => theme.notMobile} {
      background: #fff;
      z-index: 2;
    }
  }
  /* TODO: */
  .editor-settings {
    &__plugin-zone {
    }
    &__default-zone {
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
  plusRef = React.createRef() as any

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
    const plusNode = this.plusRef.current
    plusNode.style.transform = `translate3d(0, calc(${focusBlockBoundOffset}px - 50%), 0)`
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
    // for stop of double click by PlusIcon or MoreIcon
    event.preventDefault()
  }

  handlePlusClick = (event) => {
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
              <Button
                {...{
                  className: classNames('plus', {
                    'plus--hidden': !isEmptyParagraph,
                  }),
                  theme,
                  onClick: this.handlePlusClick,
                  externalRef: this.plusRef,
                }}
              >
                <div
                  {...{
                    className: classNames('plus-icon', {
                      'plus-icon--x': isOpenedToolbox,
                    }),
                  }}
                >
                  <PlusIcon />
                </div>
              </Button>

              <div
                {...{
                  className: classNames('toolbox', { 'toolbox--opened': isOpenedToolbox }),
                  ref: this.toolboxRef,
                }}
              >
                <ul>
                  {this.tools.map(({ id, src, alt, onClick }) => (
                    <li key={id}>
                      <Button
                        {...{
                          isActive: id === activeToolId,
                          theme,
                          alt,
                          onClick,
                        }}
                      >
                        {src}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              {/* <div class="tooltip" style="left: 288px; transform: translate3d(-50%, 34px, 0px);">Raw HTML</div> */}
            </div>
            <div
              {...{
                className: classNames('actions', {
                  'actions--opened': !isTitle,
                }),
              }}
            >
              <div className="actions-buttons">
                <span className="settings-btn">
                  <MoreIcon />
                </span>
              </div>
              <div className="editor-settings">
                <div className="editor-settings__plugin-zone" />
                <div className="editor-settings__default-zone" />
              </div>
            </div>
          </div>
          {/* <button>111</button> */}
        </div>
      </div>
    )
  }
}

export default Toolbar
