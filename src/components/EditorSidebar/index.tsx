import * as React from 'react'
import { Icon, Popover } from 'antd'
// import { Header1, Header2, HeaderOnePlugin, HeaderTwoPlugin } from '@canner/slate-icon-header'
// import { ParagraphPlugin } from '@canner/slate-icon-shared'
// import { getVisibleSelectionRect } from 'get-selection-range'
import { SidebarContainer, IconContainer, PopupContainer, IconWrapper } from './styled'

// type Props = {
//   icons: Array<React.Element<*> | string>,
//   plugins?: Array<any>,
//   value: Value,
//   onChange: (change: Change) => void
// };

// type State = {
//   openPopover: boolean
// };

// const defaultPlugins = [] // [ParagraphPlugin(), HeaderOnePlugin(), HeaderTwoPlugin()]

export default (options: any = {}) => {
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
    leftOffset = -20,
  } = options
  let i = 0
  return (Editor) => {
    class EditorSidebar extends React.Component {
      state = {
        openPopover: false,
      }

      sidebarContainerNode
      containerNode

      componentDidMount() {
        window.addEventListener('scroll', () => this.componentDidUpdate(this.props))
      }

      componentWillUnmount() {
        window.removeEventListener('scroll', () => this.componentDidUpdate(this.props))
      }

      componentDidUpdate(prevProps) {
        // const { value } = this.props as any
        // const { texts, focusBlock } = value
        // const currentTextNode = texts.get(0)
        // const currentLineText = currentTextNode.text
        // if (
        //   (currentLineText.length !== 0 ||
        //     focusBlock.type !== 'paragraph' ||
        //     value !== prevProps.value) &&
        //   this.state.openPopover
        // ) {
        //   this.hidePopover()
        // }
        // const rect = getVisibleSelectionRect()
        // if (!rect || !this.sidebarContainerNode || !this.containerNode) {
        //   return
        // }
        // const containerBound = this.containerNode.getBoundingClientRect()
        // const { top: containerBoundTop } = containerBound
        // this.sidebarContainerNode.style.left = `${leftOffset}px`
        // const top = rect.top - containerBoundTop - 3
        // this.sidebarContainerNode.style.top = `${top}px`
        // this.sidebarContainerNode.style.opacity = '1'
      }

      hidePopover = () => {
        this.setState({
          openPopover: false,
        })
      }

      handleVisibleChange = (visible) => {
        this.setState({
          openPopover: visible,
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
        const { openPopover } = this.state
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
            <SidebarContainer innerRef={(node) => (this.sidebarContainerNode = node)}>
              <Icon
                type="plus-circle"
                theme="outlined"
                onClick={() => this.handleVisibleChange(!openPopover)}
                className={openPopover ? 'open' : ''}
              />
              <PopupContainer isOpen={openPopover}>{content}</PopupContainer>
            </SidebarContainer>
          )
        )
        return null
      }

      render() {
        return (
          <div style={{ position: 'relative' }} ref={(node) => (this.containerNode = node)}>
            {this.renderSidebar()}
            <Editor {...this.props} />
          </div>
        )
      }
    }

    return class EditorSidebarDecorator extends React.Component {
      // shouldComponentUpdate(nextProps) {
      //   const { value } = this.props as any
      //   if (value === nextProps.value) {
      //     console.log(false)
      //     return false
      //   }
      //   return true
      // }

      render() {
        return <EditorSidebar {...this.props} />
      }
    }
  }
}
