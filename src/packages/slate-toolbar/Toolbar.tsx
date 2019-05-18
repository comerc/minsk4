import React from 'react'
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
    &--hidden {
      display: none;
    }
  }
  .content {
    max-width: ${({ theme }) => theme.contentWidth};
    margin: 0 auto;
    position: relative;
  }
  .plus-wrapper {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -${({ theme }) => theme.toolbarButtonWidth};
    animation: fadeIn 0.4s;
    display: inline-flex;
    &--hidden {
      display: none;
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
  .actions-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 7px;
    display: inline-flex;
    &--hidden {
      display: none;
    }
  }
  .more-wrapper {
    position: absolute;
    right: 2px;
    top: 3px;
    display: inline-flex;
    opacity: 1;
    &--hidden {
      display: none;
      opacity: 0;
    }
  }
`

@withSizes(({ width }) => ({ bodyWidth: width }))
@withStyle
class Toolbar extends React.Component<any, any> {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.isPlus && prevState.activeToolId !== -1) {
      return { activeToolId: -1 }
    }
    return null
  }

  state = {
    // isActions: true,
    activeActionId: -1,
    isPlus: false,
    activeToolId: -1,
    toolbarTop: 0,
    focusBlockBoundOffset: 0,
  }

  tools = this.props.getTools(this.props.editor)
  actions = this.props.getActions(this.props.editor)
  containerRef = React.createRef() as any

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
    this.setState({ toolbarTop, focusBlockBoundOffset })
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

  // openActions = () => {
  //   this.setState({ isActions: true })
  // }

  // closeActions = () => {
  //   this.setState({ isActions: false })
  // }

  // handleActionsChange = (visible) => {
  //   if (visible) {
  //     this.openActions()
  //   } else {
  //     this.closeActions()
  //   }
  // }

  openPlus = () => {
    this.setState({ isPlus: true })
  }

  closePlus = () => {
    this.setState({ isPlus: false })
  }

  handlePlusChange = (visible) => {
    if (visible) {
      this.openPlus()
    } else {
      this.closePlus()
    }
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
        this.closePlus()
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
          this.openPlus()
          this.leaf(event.shiftKey)
        }
      }
      return
    }
    if (event.key === 'Enter') {
      const { activeToolId } = this.state
      if (activeToolId > -1) {
        event.preventDefault()
        event.stopPropagation()
        this.tools[activeToolId].onClick(event)
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
        this.closePlus()
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      value: { selection, focusBlock, focusText },
      bodyWidth,
    } = this.props
    const isFocused = selection.isFocused && focusBlock
    if (isFocused) {
      const isOther = focusBlock.key !== idx(prevProps, (_) => _.value.focusBlock.key)
      const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
      if (this.state.isPlus && (isOther || !isEmptyParagraph)) {
        this.closePlus()
      }
      if (isOther || bodyWidth !== prevProps.bodyWidth) {
        this.move()
      }
    } else {
      if (this.state.isPlus) {
        this.closePlus()
      }
    }
  }

  render() {
    const {
      className,
      theme,
      editor,
      editor: { readOnly: isReadOnly },
      value: { selection, focusBlock, focusText },
      closeInterval,
      children,
    } = this.props
    const {
      // isActions,
      activeActionId,
      isPlus,
      activeToolId,
      toolbarTop,
      focusBlockBoundOffset,
    } = this.state
    const isFocused = selection.isFocused && focusBlock
    const isTitle = isFocused && focusBlock.type === 'title'
    const isEmptyParagraph = isFocused && focusBlock.type === 'paragraph' && focusText.text === ''
    const actions = (isFocused && this.actions[focusBlock.type]) || []
    return (
      <div
        {...{
          className,
          ref: this.containerRef,
          onKeyDownCapture: this.handleKeyDownCapture,
          onClickCapture: this.handleClickCapture,
        }}
      >
        <div className="wrapper">
          {children}
          <div
            {...{
              className: classNames('toolbar', {
                'toolbar--hidden': !isFocused || isReadOnly,
              }),
              style: {
                transform: `translate3D(0, ${toolbarTop}px, 0)`,
              },
              onMouseDown: this.handleToolbarMouseDown,
            }}
          >
            <div
              {...{
                className: classNames('plus-wrapper', {
                  'plus-wrapper--hidden': !isEmptyParagraph,
                }),
                style: {
                  transform: `translate3d(0, calc(${focusBlockBoundOffset}px - 50%), 0)`,
                },
              }}
            >
              <Plus
                {...{
                  theme,
                  isVisiblePopup: isPlus,
                  onVisiblePopupChange: this.handlePlusChange,
                  // open: this.openPlus,
                  close: this.closePlus,
                  closeInterval,
                  tools: this.tools,
                  activeToolId,
                }}
              />
            </div>
            <div
              {...{
                className: classNames('actions-wrapper', {
                  'actions-wrapper--hidden': !isFocused || isTitle || isEmptyParagraph,
                }),
              }}
            >
              <Actions
                {...{
                  theme,
                  // isVisiblePopup: isActions,
                  // open: this.openActions,
                  // close: this.closeActions,
                  closeInterval,
                  actions,
                  activeActionId,
                }}
              />
            </div>
            <div
              {...{
                className: classNames('more-wrapper', {
                  'more-wrapper--hidden': isTitle,
                }),
              }}
            >
              <More {...{ theme, editor, closeInterval, onMove: this.move }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Toolbar
