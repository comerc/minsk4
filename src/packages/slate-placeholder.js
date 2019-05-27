import PlaceholderPlugin from 'slate-react-placeholder'

const isOnlyOne = (document) => {
  // const firstNode = document.nodes.get(0)
  // const result =
  //   document.nodes.size === 2 && firstNode.text === document.text && firstNode.type === 'title'
  // return result
  return document.nodes.size === 1
}

const whens = {
  // title: (_editor, node) => {
  //   return node.object === 'block' && node.type === 'title' && node.text === ''
  // },

  paragraph: (editor, node) => {
    return (
      node.object === 'block' &&
      node.type === 'paragraph' &&
      node.text === '' &&
      isOnlyOne(editor.value.document)
    )
  },
}

// TODO: move to styled-components (for autoprefixer)
const style = {
  float: 'left', // for cursor
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent', // remove mobile color flashing (deprecated)
}

export default ({ type, placeholder }) => {
  if (!['title', 'paragraph'].includes(type)) {
    throw new Error("type needs to be 'title' or 'paragraph'")
  }
  return PlaceholderPlugin({
    placeholder,
    when: whens[type],
    style,
  })
}
