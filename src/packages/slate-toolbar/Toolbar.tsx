import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import classNames from 'classnames'
import withSizes from 'react-sizes'
import idx from 'idx'
import Actions from './Actions'
import Plus from './Plus'
import More from './More'

const withStyle = (Self) => styled(Self)`
  padding: 0 ${({ theme }) => theme.toolbarPaddingHorizontal};
  .wrapper {
    position: relative;
    margin: 1px auto;
    max-width: ${({ theme }) => theme.contentWidth};
  }
  .${({ editor }) => editor.props.className.replace(' ', '.')} {
    > * {
      position: relative;
      &.block--focused:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 1px;
        bottom: 1px;
        z-index: -1;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryColor5};
      }
      &.block--focused:not(.block--title) {
        background-image: linear-gradient(
          17deg,
          rgba(243, 248, 255, 0.03) 63.45%,
          rgba(207, 214, 229, 0.27) 98%
        );
      }
    }
  }
  .toolbar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    display: block;
  }
  ${Plus} {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -${({ theme }) => theme.toolbarButtonWidth};
    animation: fadeIn 0.4s;
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
  ${Actions} {
    position: absolute;
    left: 0;
    right: 0;
    top: 7px;
  }
  ${More} {
    position: absolute;
    right: 2px;
    top: 3px;
  }
`

@withSizes(({ width }) => ({ bodyWidth: width }))
@withStyle
class Toolbar extends React.Component<any, any> {
  static getDerivedStateFromProps(nextProps, prevState) {
    let result = {} as any
    if (!prevState.isPlus && prevState.activeToolId !== -1) {
      result = { ...result, activeToolId: -1 }
    }
    const {
      value: { selection, focusBlock, focusText },
      bodyWidth,
    } = nextProps
    const focusBlockKey = idx(nextProps, (_) => _.value.focusBlock.key)
    if (prevState.focusBlockKey !== focusBlockKey) {
      result = { ...result, focusBlockKey }
    }
    if (prevState.bodyWidth !== bodyWidth) {
      result = { ...result, bodyWidth }
    }
    if (prevState.isHiddenPlusPopup) {
      result = { ...result, isHiddenPlusPopup: false }
    }
    const isFocused = selection.isFocused && !!focusBlock
    if (isFocused) {
      const isOther = prevState.focusBlockKey !== focusBlock.key
      const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
      if (prevState.isPlus && (isOther || !isEmptyParagraph)) {
        result = { ...result, isPlus: false, isHiddenPlusPopup: true }
      }
      if (isOther || prevState.bodyWidth !== bodyWidth) {
        result = { ...result, ...Toolbar.move(nextProps) }
      }
    } else {
      if (prevState.isPlus) {
        result = { ...result, isPlus: false }
      }
    }
    return result
  }

  static move = (props) => {
    const {
      editor,
      value: { focusBlock },
    } = props
    const containerNode = ReactDOM.findDOMNode(editor) as any
    const focusBlockNode = containerNode.querySelector(`[data-key="${focusBlock.key}"`)
    if (!focusBlockNode) {
      // if call in getDerivedStateFromProps() for new node before render(),
      // then call again in componentDidUpdate()
      return { needMoveForNewBlock: true }
    }
    const focusBlockBound = focusBlockNode.getBoundingClientRect()
    const { top: containerBoundTop } = containerNode.getBoundingClientRect()
    const toolbarTop = Math.round(focusBlockBound.top - containerBoundTop)
    const focusBlockBoundOffset = Math.round(focusBlockBound.height / 2)
    return { toolbarTop, focusBlockBoundOffset, needMoveForNewBlock: false }
  }

  state = {
    activeActionId: -1,
    isHiddenPlusPopup: false, // for move() w/o close-animation between two empty paragraph
    isPlus: false,
    activeToolId: -1,
    bodyWidth: 0, // only for getDerivedStateFromProps
    focusBlockKey: null, // only for getDerivedStateFromProps
    needMoveForNewBlock: false,
    toolbarTop: 0,
    focusBlockBoundOffset: 0,
  }

  tools = this.props.getTools(this.props.editor)
  actions = this.props.getActions(this.props.editor)

  handleMoveClick = () => {
    this.setState(Toolbar.move(this.props))
  }

  focus = () => {
    const {
      editor,
      value: { selection, document },
    } = this.props
    if (!selection.isFocused) {
      const containerNode = ReactDOM.findDOMNode(editor) as any
      const documentNode = containerNode.querySelector(`[data-key="${document.key}"`)
      documentNode.focus()
    }
  }

  /**
   * Leaf
   * flip through the items
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

  handlePlusChange = (visible) => {
    this.setState({ isPlus: visible })
  }

  handleToolbarMouseDown = (event) => {
    /* for stop of double click by PlusIcon or MoreIcon */
    // TODO: проверить pointer-events: none для svg
    event.preventDefault()
  }

  handleKeyDownCapture = (event) => {
    if (event.key === 'Escape') {
      if (this.state.isPlus) {
        event.preventDefault()
        event.stopPropagation()
        this.setState({ isPlus: false })
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
      if (this.state.isPlus) {
        event.preventDefault()
        event.stopPropagation()
        this.leaf(event.shiftKey)
      } else {
        const {
          value: { focusBlock, focusText },
        } = this.props
        const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
        if (isEmptyParagraph) {
          event.preventDefault()
          event.stopPropagation()
          this.setState({ isPlus: true })
          this.leaf(event.shiftKey)
        }
      }
      return
    }
    if (event.key === 'Enter') {
      const { activeToolId } = this.state
      if (activeToolId !== -1) {
        const { clickInterval } = this.props
        event.preventDefault()
        event.stopPropagation()
        setTimeout(() => {
          this.setState({ isPlus: false })
          this.tools[activeToolId].onClick(event)
        }, clickInterval)
      }
      return
    }
  }

  handleClickCapture = (event) => {
    if (this.state.isPlus) {
      const key = event.target.dataset.key
      const {
        value: { focusBlock, document },
      } = this.props
      if ([focusBlock.key, document.key].includes(key)) {
        this.setState({ isPlus: false })
      }
    }
  }

  componentDidUpdate() {
    if (this.state.needMoveForNewBlock) {
      this.setState(Toolbar.move(this.props))
    }
  }

  render() {
    const {
      className,
      theme,
      editor,
      editor: { readOnly: isReadOnly },
      value: { selection, focusBlock, focusText },
      clickInterval,
      children,
    } = this.props
    const {
      activeActionId,
      isHiddenPlusPopup,
      isPlus,
      activeToolId,
      toolbarTop,
      focusBlockBoundOffset,
    } = this.state
    const isFocused = selection.isFocused && !!focusBlock
    const isTitle = isFocused && focusBlock.type === 'title'
    const isEmptyParagraph = isFocused && focusBlock.type === 'paragraph' && focusText.text === ''
    const actions = (isFocused && this.actions[focusBlock.type]) || []
    return (
      <div
        {...{
          className,
          onKeyDownCapture: this.handleKeyDownCapture,
          onClickCapture: this.handleClickCapture,
        }}
      >
        <div className="wrapper">
          {children}
          {isFocused && !isReadOnly && (
            <div
              {...{
                className: 'toolbar',
                style: {
                  transform: `translate3D(0, ${toolbarTop}px, 0)`,
                },
                onMouseDown: this.handleToolbarMouseDown,
              }}
            >
              {isEmptyParagraph && (
                <Plus
                  {...{
                    theme,
                    focusBlockBoundOffset,
                    isHiddenPopup: isHiddenPlusPopup,
                    isVisiblePopup: isPlus,
                    onVisiblePopupChange: this.handlePlusChange,
                    clickInterval,
                    tools: this.tools,
                    activeToolId,
                  }}
                />
              )}
              {!isEmptyParagraph && actions.length !== 0 && (
                <Actions
                  {...{
                    theme,
                    clickInterval,
                    actions,
                    activeActionId,
                  }}
                />
              )}
              {!isTitle && (
                <More
                  {...{
                    theme,
                    editor,
                    clickInterval,
                    onMoveClick: this.handleMoveClick,
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Toolbar
