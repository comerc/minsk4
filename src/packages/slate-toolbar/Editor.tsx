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
  static defaultProps = {
    highlights: [
      { type: 'bold', src: 'B', title: 'Bold' },
      { type: 'italic', src: 'I', title: 'Italic' },
      { type: 'underlined', src: 'U', title: 'Underlined' },
      { type: 'code', src: 'C', title: 'Code' },
    ],
  }

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
    if (prevState.isSelected !== isSelected) {
      result = { ...result, isSelected }
    }
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
      if (prevState.isEmptyParagraph !== isEmptyParagraph) {
        result = { ...result, isEmptyParagraph }
      }
      if (prevState.isPlusPopup && (isOther || !isEmptyParagraph)) {
        result = { ...result, isPlusPopup: false }
        if (!prevState.isHiddenPlusPopup) {
          result = { ...result, isHiddenPlusPopup: true }
        }
      }
      if (isOther || prevState.bodyWidth !== bodyWidth) {
        result = { ...result, ...Editor.moveToolbar(nextProps) }
      }
      if (prevState.isActions && isOther) {
        result = { ...result, isActions: false }
      }
    } else {
      if (prevState.isEmptyParagraph) {
        result = { ...result, isEmptyParagraph: false }
      }
      if (prevState.isPlusPopup) {
        result = { ...result, isPlusPopup: false }
      }
      if (prevState.isActions) {
        result = { ...result, isActions: false }
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
    highlightsLeft: 0,
    highlightsTop: 0,
    isActions: false,
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
  isMouseDown = false
  wrapperRef = React.createRef()

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
    const { tools } = this.props
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
      id = (tools.length + id - 1) % tools.length
    } else {
      /**
       * If we go right then choose next (+1) Tool
       */
      id = (id + 1) % tools.length
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
      if (!this.state.isPlusPopup) {
        return
      }
      // TODO: move to Plus - double code with Plus.handleToolClick()
      const { activeToolId } = this.state
      if (activeToolId !== -1) {
        const { tools, timeout, clickInterval } = this.props
        event.preventDefault()
        event.stopPropagation()
        timeout(() => {
          this.setState({ isPlusPopup: false })
          tools[activeToolId].onClick(event)
        }, clickInterval)
      }
      return
    }
  }

  // TODO: recall wheh 3 clicks
  // TODO: recall wheh change bodyWidth
  moveHighlights = () => {
    const wrapperNode = this.wrapperRef.current as any
    const { left, top } = wrapperNode.getBoundingClientRect()
    const native = window.getSelection() as any
    const range = native.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const style: any = {}
    return {
      highlightsLeft: rect.left + rect.width / 2 - left,
      highlightsTop: rect.top - top,
    }
  }

  handleMouseDownCapture = (event) => {
    this.isMouseDown = true
    // Q: зачем тут timeout?
    // A: isActions переключается в getDerivedStateFromProps
    const { timeout } = this.props
    timeout(() => {
      const { isActions } = this.state
      if (isActions) {
        this.setState({ isActions: false })
      }
    })
  }

  handleMouseLeave = (event) => {
    if (this.isMouseDown) {
      this.isMouseDown = false
    }
  }

  handleBlur = (event) => {
    if (this.isMouseDown) {
      this.isMouseDown = false
    }
  }

  handleMouseMoveCapture = (event) => {
    const isButtons = IS_SAFARI ? !!event.which : !!event.buttons
    if (isButtons) {
      return
    }
    const { isHighlights, isActions, isSelected } = this.state
    if (!isHighlights && isSelected) {
      this.setState({ isHighlights: true, ...this.moveHighlights() })
    }
    if (!isActions && !isSelected) {
      this.setState({ isActions: true })
    }
  }

  handleMouseUpCapture = () => {
    const { isHighlights, isActions, isSelected } = this.state
    if (!isHighlights && isSelected) {
      this.setState({ isHighlights: true, ...this.moveHighlights() })
    }
    if (isHighlights && event.detail === 3) {
      // TODO: анимировать изменение позиции для Highlights
      this.setState(this.moveHighlights())
    }
    if (!isActions && !isSelected) {
      this.setState({ isActions: true })
    }
    if (this.isMouseDown) {
      this.isMouseDown = false
      this.forceUpdate()
    }
  }

  // TODO: убрать мигание isActions при кликах мышкой в разных местах по одному блоку

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
      tools,
      highlights,
      actionsByType,
    } = this.props
    const {
      isFocused,
      isEmptyParagraph,
      isSelected,
      isHighlights,
      highlightsLeft,
      highlightsTop,
      isActions,
      activeActionId,
      isHiddenPlusPopup,
      isPlusPopup,
      activeToolId,
      toolbarTop,
      focusBlockBoundOffset,
    } = this.state
    const actions: any = (focusBlock && idx(actionsByType, (self) => self[focusBlock.type])) || []
    console.log({ isHighlights })
    return (
      <div
        {...{
          className,
          onKeyDownCapture: this.handleKeyDownCapture,
          onMouseDownCapture: this.handleMouseDownCapture,
          onMouseMoveCapture: this.handleMouseMoveCapture,
          onMouseLeave: this.handleMouseLeave,
          onBlur: this.handleBlur,
          onMouseUpCapture: this.handleMouseUpCapture,
        }}
      >
        <Wrapper {...{ isSelected, ref: this.wrapperRef }}>
          {children}
          {isFocused && !isReadOnly && (
            <div {...{ onMouseDown: this.handlePopupsMouseDown }}>
              {isHighlights && (
                <Highlights
                  {...{
                    editor,
                    highlights,
                    clickInterval,
                    left: highlightsLeft,
                    top: highlightsTop,
                  }}
                />
              )}
              {!isSelected && (
                <Toolbar {...{ toolbarTop }}>
                  {isEmptyParagraph && (
                    <Plus
                      {...{
                        focusBlockBoundOffset,
                        offsetX: theme.toolbarButtonWidth,
                        isHiddenPopup: isHiddenPlusPopup,
                        isVisiblePopup: isPlusPopup,
                        onVisiblePopupChange: this.handlePlusPopupChange,
                        clickInterval,
                        tools,
                        activeToolId,
                      }}
                    />
                  )}
                  {isActions && !isEmptyParagraph && actions.length !== 0 && (
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
              )}
            </div>
          )}
        </Wrapper>
      </div>
    )
  }
}

export default Editor
