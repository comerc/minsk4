import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import idx from 'idx'
import { IS_SAFARI } from 'slate-dev-environment'
import withSizes from 'react-sizes'
import withContainerNode from './withContainerNode'
import withTimeouts from 'src/packages/react-timeouts'
import Wrapper from './Wrapper'
import Highlights from './Highlights'
import Toolbar from './Toolbar'
import Actions from './Actions'
import Plus from './Plus'
import More from './More'

const withStyle = (Self) => styled(Self)`
  padding: 0 ${({ theme }) => theme.toolbarPaddingHorizontal};
  ${Wrapper} {
    position: relative;
    margin: 1px auto;
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
      &.block--focused {
        background-image: linear-gradient(
          17deg,
          rgba(243, 248, 255, 0.03) 63.45%,
          rgba(207, 214, 229, 0.27) 98%
        );
      }
    }
  }
  ${Highlights} {
    position: absolute;
    left: 0;
    top: 0;
  }
  ${Toolbar} {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
  ${Plus} {
    position: absolute;
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

@withStyle
@withSizes(({ width }) => ({ bodyWidth: width }))
@withContainerNode
@withTimeouts
class Editor extends React.Component<any, any> {
  static getDerivedStateFromProps(nextProps, prevState) {
    let result = {} as any
    if (!prevState.isPlusPopup && prevState.activeToolId !== -1) {
      result = { ...result, activeToolId: -1 }
    }
    const {
      value: { selection, focusBlock, focusText },
      bodyWidth,
    } = nextProps
    const isSelected =
      selection.start.key !== selection.end.key || selection.start.offset !== selection.end.offset
    result = { ...result, isSelected }
    if (prevState.isHighlights && !isSelected) {
      result = { ...result, isHighlights: false }
    }
    const focusBlockKey = idx(focusBlock, (self) => self.key)
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
    result = { ...result, isFocused }
    if (isFocused) {
      const isOther = prevState.focusBlockKey !== focusBlock.key
      const isEmptyParagraph = focusBlock.type === 'paragraph' && focusText.text === ''
      result = { ...result, isEmptyParagraph }
      if (prevState.isPlusPopup && (isOther || !isEmptyParagraph)) {
        result = { ...result, isPlusPopup: false, isHiddenPlusPopup: true }
      }
      if (isOther || prevState.bodyWidth !== bodyWidth) {
        result = { ...result, ...Editor.moveToolbar(nextProps) }
      }
    } else {
      result = { ...result, isEmptyParagraph: false }
      if (prevState.isPlusPopup) {
        result = { ...result, isPlusPopup: false }
      }
    }
    return result
  }

  static moveToolbar = (props) => {
    const {
      containerNode,
      editor,
      value: { focusBlock },
    } = props
    const focusBlockNode = containerNode.querySelector(`[data-key="${focusBlock.key}"`)
    if (!focusBlockNode) {
      // if call in getDerivedStateFromProps() for new node before render(),
      // then call again in componentDidUpdate()
      return { isMoveToolbarForNewBlock: true }
    }
    const focusBlockBound = focusBlockNode.getBoundingClientRect()
    const { top: containerBoundTop } = containerNode.getBoundingClientRect()
    const toolbarTop = Math.round(focusBlockBound.top - containerBoundTop)
    const focusBlockBoundOffset = Math.round(focusBlockBound.height / 2)
    return { toolbarTop, focusBlockBoundOffset, isMoveToolbarForNewBlock: false }
  }

  state = {
    isFocused: false,
    isEmptyParagraph: false,
    isSelected: false,
    isHighlights: false,
    activeActionId: -1,
    isHiddenPlusPopup: false, // for moveToolbar() w/o close-animation between two empty paragraph
    isPlusPopup: false,
    activeToolId: -1,
    bodyWidth: 0, // only for getDerivedStateFromProps
    focusBlockKey: null, // only for getDerivedStateFromProps
    isMoveToolbarForNewBlock: false,
    toolbarTop: 0,
    focusBlockBoundOffset: 0,
  }
  tools = this.props.getTools(this.props.editor)
  actions = this.props.getActions(this.props.editor)

  handleMoveBlockClick = (callback) => {
    const { containerNode } = this.props
    const { top: containerBoundTop } = containerNode.getBoundingClientRect()
    this.setState({ toolbarTop: containerBoundTop - 1000 })
    callback(() => this.setState(Editor.moveToolbar(this.props)))
  }

  // focus = () => {
  //   const {
  //     editor,
  //     value: { selection, document },
  //   } = this.props
  //   if (!selection.isFocused) {
  //     const { containerNode } = this.props
  //     const documentNode = containerNode.querySelector(`[data-key="${document.key}"`)
  //     documentNode.focus()
  //   }
  // }

  /**
   * Leaf
   * flip through the items
   */
  leafTools = (isReverseDirection = false) => {
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

  handlePlusPopupChange = (visible) => {
    if (visible) {
      this.setState({ isPlusPopup: true })
    } else {
      const { timeout } = this.props
      // Q: зачем тут нужен timeout?
      // A: при клике мышкой по новому пустому параграфу перерисовывались:
      // - крестик в плюсик на старом месте
      // - курсор на новом месте без рамки фокуса
      timeout(() => this.setState({ isPlusPopup: false }))
    }
  }

  handlePopupsMouseDown = (event) => {
    event.preventDefault()
  }

  handleKeyDownCapture = (event) => {
    if (event.key === 'Escape') {
      if (this.state.isPlusPopup) {
        event.preventDefault()
        event.stopPropagation()
        this.setState({ isPlusPopup: false })
      }
      return
    }
    if (event.key === 'Tab') {
      if (!this.state.isFocused) {
        return
      }
      if (this.state.isPlusPopup) {
        event.preventDefault()
        event.stopPropagation()
        this.leafTools(event.shiftKey)
      } else {
        if (this.state.isEmptyParagraph) {
          event.preventDefault()
          event.stopPropagation()
          this.setState({ isPlusPopup: true })
          this.leafTools(event.shiftKey)
        }
      }
      return
    }
    if (event.key === 'Enter') {
      // TODO: move to Plus - double code with Plus.handleToolClick()
      const { activeToolId } = this.state
      if (activeToolId !== -1) {
        const { timeout, clickInterval } = this.props
        event.preventDefault()
        event.stopPropagation()
        timeout(() => {
          this.setState({ isPlusPopup: false })
          this.tools[activeToolId].onClick(event)
        }, clickInterval)
      }
      return
    }
  }

  // TODO: не работает isHighlights для [ctrl+a]

  // WIP
  moveHighlights = () => {
    const native = window.getSelection() as any
    const range = native.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const style: any = {}
    const menu = {
      offsetHeight: 0,
      offsetWidth: 0,
    }
    style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`
    style.left = `${rect.left + window.pageXOffset - menu.offsetWidth / 2 + rect.width / 2}px`
    console.log(style)
  }

  handleMouseMoveCapture = (event) => {
    const isLeftButton = IS_SAFARI ? event.which === 1 : event.buttons === 1
    if (isLeftButton) {
      return
    }
    const { isHighlights, isSelected } = this.state
    if (!isHighlights && isSelected) {
      this.setState({ isHighlights: true })
      this.moveHighlights()
    }
  }

  handleClickCapture = () => {
    const { isHighlights, isSelected } = this.state
    if (!isHighlights && isSelected) {
      this.setState({ isHighlights: true })
      this.moveHighlights()
    }
  }

  componentDidUpdate() {
    if (this.state.isMoveToolbarForNewBlock) {
      this.setState(Editor.moveToolbar(this.props))
    }
  }

  render() {
    const {
      className,
      theme,
      editor,
      editor: { readOnly: isReadOnly },
      value: { focusBlock },
      clickInterval,
      children,
    } = this.props
    const {
      isFocused,
      isEmptyParagraph,
      isSelected,
      isHighlights,
      activeActionId,
      isHiddenPlusPopup,
      isPlusPopup,
      activeToolId,
      toolbarTop,
      focusBlockBoundOffset,
    } = this.state
    const actions = (focusBlock && this.actions[focusBlock.type]) || []
    return (
      <div
        {...{
          className,
          onKeyDownCapture: this.handleKeyDownCapture,
          onMouseMoveCapture: this.handleMouseMoveCapture,
          onClickCapture: this.handleClickCapture,
        }}
      >
        <Wrapper {...{ toolbarTop, focusBlockBoundOffset }}>
          {children}
          {isFocused && !isReadOnly && (
            <div {...{ onMouseDown: this.handlePopupsMouseDown }}>
              {isHighlights && <Highlights />}
              <Toolbar>
                {isEmptyParagraph && (
                  <Plus
                    {...{
                      offsetX: theme.toolbarButtonWidth,
                      isHiddenPopup: isHiddenPlusPopup,
                      isVisiblePopup: isPlusPopup,
                      onVisiblePopupChange: this.handlePlusPopupChange,
                      clickInterval,
                      tools: this.tools,
                      activeToolId,
                    }}
                  />
                )}
                {!isSelected && !isEmptyParagraph && actions.length !== 0 && (
                  <Actions
                    {...{
                      clickInterval,
                      actions,
                      activeActionId,
                    }}
                  />
                )}
                <More
                  {...{
                    editor,
                    clickInterval,
                    onMoveBlockClick: this.handleMoveBlockClick,
                  }}
                />
              </Toolbar>
            </div>
          )}
        </Wrapper>
      </div>
    )
  }
}

export default Editor
