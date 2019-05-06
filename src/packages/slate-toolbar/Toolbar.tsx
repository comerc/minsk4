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
    transition: opacity 100ms ease;
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
  /* FIXME: при включенной анимации, пропадает MoreIcon, если кликнуть по PlusIcon  */
  /* .plus-icon {
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
  } */
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
    transition: opacity 100ms ease;
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
    transition: opacity 150ms ease-in, left 0.1s linear;
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
      transition-delay: 0.1s, 0s;
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
  }

  containerRef = React.createRef() as any
  toolbarRef = React.createRef() as any
  toolboxRef = React.createRef() as any
  plusRef = React.createRef() as any

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
    this.setState({ isOpenedToolbox: false })
    this.focus()
  }

  tools = this.props
    .getTools(this.props.editor)
    .map(({ onClick, ...rest }) => ({ onClick: this.handleToolClick(onClick), ...rest }))

  handleMouseDown = (event) => {
    const {
      value: { selection },
    } = this.props
    if (!selection.isFocused) {
      // for stop of double click by PlusIcon or MoreIcon
      event.preventDefault()
    }
  }

  handlePlusClick = (event) => {
    this.setState((prevState) => {
      const { isOpenedToolbox } = prevState
      if (isOpenedToolbox) {
        this.focus()
      }
      return {
        isOpenedToolbox: !isOpenedToolbox,
      }
    })
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      const { isOpenedToolbox } = this.state
      if (isOpenedToolbox) {
        event.preventDefault()
        const plusNode = this.plusRef.current
        plusNode.click()
      }
    }
    if (event.key === 'Tab') {
      const { value } = this.props
      const { selection } = value
      if (!selection.isFocused) {
        return
      }
      const { isOpenedToolbox } = this.state
      if (isOpenedToolbox) {
        event.preventDefault()
      } else {
        const { focusBlock, focusText } = value
        const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
        if (isEmptyParagraph) {
          event.preventDefault()
          const plusNode = this.plusRef.current
          plusNode.click()
        }
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
    const { isOpenedToolbox } = this.state
    const isOtherBlock = focusBlock.key !== idx(prevProps, (_) => _.value.focusBlock.key)
    const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
    if (isOpenedToolbox && (isOtherBlock || !isEmptyParagraph)) {
      this.setState({
        isOpenedToolbox: false,
      })
    }
    if (isOtherBlock) {
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
  }

  render() {
    const {
      className,
      theme,
      editor: { readOnly: isReadOnly },
      value: { focusBlock, focusText },
      children,
    } = this.props
    const { isOpenedToolbox } = this.state
    const isTitle = focusBlock.type === 'title'
    const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
    return (
      <div {...{ className, ref: this.containerRef, onKeyDown: this.handleKeyDown }}>
        <div className="wrapper">
          {children}
          <div
            {...{
              className: classNames('toolbar', {
                'toolbar--opened': !isReadOnly,
              }),
              ref: this.toolbarRef,
              onMouseDown: this.handleMouseDown,
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
                {/* <svg class="icon icon--plus" width="14px" height="14px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#plus"></use></svg> */}
                <PlusIcon
                  {...{
                    className: classNames('plus-icon', {
                      'plus-icon--x': isOpenedToolbox,
                    }),
                  }}
                />
              </Button>
              <div
                {...{
                  className: classNames('toolbox', { 'toolbox--opened': isOpenedToolbox }),
                  ref: this.toolboxRef,
                }}
              >
                <ul>
                  {this.tools.map(({ src, alt, onClick }) => (
                    <li key={alt}>
                      <Button {...{ theme, alt, onClick }}>{src}</Button>
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
                  {/* <svg class="icon icon--dots" width="18px" height="4px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#dots"></use></svg> */}
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
