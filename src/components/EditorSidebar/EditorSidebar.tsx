import * as React from 'react'
import { Icon, Popover } from 'antd'
// import { Header1, Header2, HeaderOnePlugin, HeaderTwoPlugin } from '@canner/slate-icon-header'
// import { ParagraphPlugin } from '@canner/slate-icon-shared'
import { getVisibleSelectionRect } from 'get-selection-range'
import {
  Container,
  SidebarContainer,
  IconContainer,
  PopupContainer,
  IconWrapper,
} from './EditorSidebar.styled'

// type Props = {
//   icons: Array<React.Element<*> | string>,
//   plugins?: Array<any>,
//   value: Value,
//   onChange: (change: Change) => void
// };

// type State = {
//   isOpenPopover: boolean
// };

// const defaultPlugins = [] // [ParagraphPlugin(), HeaderOnePlugin(), HeaderTwoPlugin()]

const sidebar = (options: any = {}) => {
  let {
    icons = [
      // {
      //   icon: Header1,
      //   title: 'Header One',
      // },
      // {
      //   icon: Header2,
      //   title: 'Header Two',
      // },
    ],
    leftOffset = 0,
  } = options
  let i = 0
  return (Editor) => {
    return class EditorSidebar extends React.Component {
      state = {
        isOpenPopover: false,
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
          this.state.isOpenPopover
        ) {
          this.setState({
            isOpenPopover: false,
          })
          return
        }
        if (this.state.isOpenPopover) {
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
        // this.sidebarContainerNode.style.opacity = '1'
      }

      handlePlusIconClick = () => {
        this.setState((prevState) => {
          const { isOpenPopover } = prevState as any
          if (isOpenPopover) {
            setTimeout(() => this.editorNode.focus())
          }
          return {
            isOpenPopover: !isOpenPopover,
          }
        })
      }

      renderButton = (Type, title) => {
        // const { value, onChange } = this.props as any
        // change={value.change()}
        // onChange={onChange}
        return (
          <IconContainer key={i++}>
            <IconWrapper>
              <Type
                className="__slate-sidebar_slateToolbarItem"
                strokeClassName="qlStroke"
                strokeMitterClassName="qlStrokeMitter"
                fillClassName="qlFill"
                evenClassName="qlEven"
                colorLabelClassName="qlColorLabel"
                thinClassName="qlThin"
                activeStrokeMitterClassName="qlStrokeMitterActive"
                activeClassName="__slate-sidebar_slateToolbarItem __slate-sidebar_slateToolbarActiveItem"
                activeStrokeClassName="qlStrokeActive"
                activeFillClassName="qlFillActive"
                activeThinClassName="qlThinActive"
                activeEvenClassName="qlEvenActive"
              />
            </IconWrapper>
            <div>{title}</div>
          </IconContainer>
        )
      }

      renderSidebar = () => {
        const { value } = this.props as any
        const { isOpenPopover } = this.state
        const { texts, focusBlock } = value
        const currentTextNode = texts.get(0)
        if (!currentTextNode) {
          return null
        }
        const currentLineText = currentTextNode.text
        const content = '123' // icons.map((item) => this.renderButton(item.icon, item.title))
        return (
          currentLineText.length === 0 &&
          focusBlock.type === 'paragraph' && (
            <SidebarContainer ref={this.sidebarContainerRef}>
              <div>
                <Icon
                  type="plus-circle"
                  theme="outlined"
                  onClick={this.handlePlusIconClick}
                  className={isOpenPopover ? 'open' : ''}
                />
              </div>
              <PopupContainer isOpen={isOpenPopover}>{content}</PopupContainer>
            </SidebarContainer>
          )
        )
      }

      render() {
        return (
          <Container ref={this.containerRef}>
            {this.renderSidebar()}
            <Editor editorRef={this.editorRef} {...this.props} />
          </Container>
        )
      }
    }

    // return class EditorSidebarDecorator extends React.Component {
    //   // shouldComponentUpdate(nextProps) {
    //   //   const { value } = this.props as any
    //   //   if (value === nextProps.value) {
    //   //     console.log(false)
    //   //     return false
    //   //   }
    //   //   return true
    //   // }

    //   render() {
    //     return <EditorSidebar {...this.props} />
    //   }
    // }
  }
}

export default sidebar
