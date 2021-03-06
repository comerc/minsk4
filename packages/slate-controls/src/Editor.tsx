import React from 'react'
import styled from 'styled-components'
import { IS_SAFARI } from 'slate-dev-environment'
import withSizes from 'react-sizes'
import withContainerNode from './withContainerNode'
import withTimeout from 'react-timeout'
import Wrapper from './Wrapper'
import Highlights from './Highlights'
import Toolbar from './Toolbar'
import Actions from './Actions'
import Plus from './Plus'
import More from './More'

const withStyle = (Self) => styled(Self)`
  padding: 0 ${({ theme }) => theme.toolbarPaddingHorizontal};
  .${({ editor }) => editor.props.className.replace(' ', '.')} {
    > * {
      margin: 0 -11px;
      padding: 0 11px;
    }
  }
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
  }
  ${Actions} {
    position: absolute;
    left: 0;
    right: 0;
    top: 5px;
  }
  ${More} {
    position: absolute;
    right: -9px;
    top: 2px;
  }
`

@withStyle
@withSizes(({ width }) => ({ bodyWidth: width }))
@withContainerNode
@withTimeout
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
    if (prevState.isSelected !== isSelected) {
      result = { ...result, isSelected }
    }
    if (prevState.isHighlights && !isSelected) {
      result = { ...result, isHighlights: false }
    }
    const focusBlockKey = focusBlock && focusBlock.key
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
      if (prevState.isHighlights && isSelected && prevState.bodyWidth !== bodyWidth) {
        result = { ...result, ...Editor.moveHighlights(nextProps) }
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

  static moveHighlights = (props) => {
    const { containerNode } = props
    const wrapperNode = containerNode.firstChild
    const { left, top } = wrapperNode.getBoundingClientRect()
    const native = window.getSelection() as any
    const range = native.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    return {
      highlightsLeft: rect.left + rect.width / 2 - left,
      highlightsTop: rect.top - top,
      hightlightsHasTransition: false,
    }
  }

  state = {
    isFocused: false,
    isEmptyParagraph: false,
    isSelected: false,
    isHighlights: false,
    highlightsLeft: 0,
    highlightsTop: 0,
    hightlightsHasTransition: false,
    lastActionsBlockKey: null,
    isActions: false,
    activeActionId: -1, // TODO: может быть несколько активных - заменить на массив activeActionIds
    isHiddenPlusPopup: false, // for moveToolbar() w/o close-animation between two empty paragraph
    isPlusPopup: false,
    activeToolId: -1,
    bodyWidth: 0, // only for getDerivedStateFromProps
    focusBlockKey: null,
    isMoveToolbarForNewBlock: false,
    toolbarTop: 0,
    focusBlockBoundOffset: 0,
  }
  isMouseDown = false

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

  handleMoveBlockClick = (callback) => {
    const { containerNode } = this.props
    const { top: containerBoundTop } = containerNode.getBoundingClientRect()
    this.setState({ toolbarTop: containerBoundTop - 1000 })
    callback(() => this.setState(Editor.moveToolbar(this.props)))
  }

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
      // Q: зачем setTimeout?
      // A: при клике мышкой по новому пустому параграфу перерисовывались:
      // - крестик в плюсик на старом месте
      // - курсор на новом месте без рамки фокуса
      this.props.setTimeout(() => this.setState({ isPlusPopup: false }))
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
        const { tools, clickInterval } = this.props
        event.preventDefault()
        event.stopPropagation()
        this.props.setTimeout(() => {
          this.setState({ isPlusPopup: false })
          tools[activeToolId].onClick(event)
        }, clickInterval)
      }
      return
    }
  }

  handleMouseDownCapture = (event) => {
    this.isMouseDown = true
    if (event.target.dataset.isAction) {
      return
    }
    // Q: зачем setTimeout?
    // A: isActions переключается раньше в getDerivedStateFromProps,
    // при клике на другой блок - лишний render()
    this.props.setTimeout(() => {
      const { isActions, lastActionsBlockKey, focusBlockKey } = this.state
      // Q: зачем lastActionsBlockKey
      // A: убирает мигание Actions при кликах мышкой в разных местах по одному блоку
      if (isActions && lastActionsBlockKey !== focusBlockKey) {
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
    const { isHighlights, isActions, isSelected, focusBlockKey } = this.state
    if (!isHighlights && isSelected) {
      this.setState({ isHighlights: true, ...Editor.moveHighlights(this.props) })
    }
    if (!isActions && !isSelected) {
      this.setState({ isActions: true, lastActionsBlockKey: focusBlockKey })
    }
  }

  handleMouseUpCapture = (event) => {
    const { isHighlights, isSelected } = this.state
    if (!isHighlights && isSelected) {
      // Q: зачем отключение isActions?
      // A: предотвращает мигание Actions при последовательных селектах мышкой
      this.setState({ isActions: false, isHighlights: true, ...Editor.moveHighlights(this.props) })
    }
    if (isHighlights && event.detail === 3) {
      this.setState({ ...Editor.moveHighlights(this.props), hightlightsHasTransition: true })
    }
    if (this.isMouseDown) {
      this.isMouseDown = false
      this.forceUpdate()
    }
    if (event.detail === 1) {
      // Q: зачем setTimeout?
      // A: сбрасывает isSelected
      // Q: зачем 400?
      // A: ожидает double click для селекта в новом фокус-блоке
      this.props.setTimeout(() => {
        const { isActions, isSelected, focusBlockKey } = this.state
        if (!isActions && !isSelected) {
          this.setState({ isActions: true, lastActionsBlockKey: focusBlockKey })
        }
      }, 400)
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
      editor,
      editor: { readOnly: isReadOnly },
      value: { focusBlock },
      clickInterval,
      children,
      tools,
      highlights,
      actionsByType,
      plusPopupOffset,
      icons: { PlusIcon, MoreIcon, ArrowUpIcon, DeleteIcon, ArrowDownIcon },
    } = this.props
    const {
      isFocused,
      isEmptyParagraph,
      isSelected,
      isHighlights,
      highlightsLeft,
      highlightsTop,
      hightlightsHasTransition,
      isActions,
      activeActionId,
      isHiddenPlusPopup,
      isPlusPopup,
      activeToolId,
      toolbarTop,
      focusBlockBoundOffset,
    } = this.state
    const actions: any = (focusBlock && actionsByType[focusBlock.type]) || []
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
        <Wrapper {...{ isSelected }}>
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
                    hasTransition: hightlightsHasTransition,
                  }}
                />
              )}
              {!isSelected && (
                <Toolbar {...{ toolbarTop }}>
                  {isEmptyParagraph && (
                    <Plus
                      {...{
                        editor,
                        focusBlockBoundOffset,
                        popupOffset: plusPopupOffset,
                        isHiddenPopup: isHiddenPlusPopup,
                        isVisiblePopup: isPlusPopup,
                        onVisiblePopupChange: this.handlePlusPopupChange,
                        clickInterval,
                        tools,
                        activeToolId,
                        PlusIcon,
                      }}
                    />
                  )}
                  {isActions && !isEmptyParagraph && actions.length !== 0 && (
                    <Actions
                      {...{
                        editor,
                        clickInterval,
                        actions,
                        activeActionId,
                      }}
                    />
                  )}
                  {!isEmptyParagraph && (
                    <More
                      {...{
                        editor,
                        clickInterval,
                        onMoveBlockClick: this.handleMoveBlockClick,
                        MoreIcon,
                        ArrowUpIcon,
                        DeleteIcon,
                        ArrowDownIcon,
                      }}
                    />
                  )}
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
