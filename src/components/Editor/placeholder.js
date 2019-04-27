import PlaceholderPlugin from 'slate-react-placeholder'

const isOnlyTitle = (node) =>
  node.object === 'document' && node.nodes.size === 2 && node.text === node.getTexts().get(0).text

const whens = {
  title: (_editor, node) => node.object === 'block' && node.type === 'title' && node.text === '',
  paragraph: (editor, node) =>
    node.object === 'block' &&
    node.type === 'paragraph' &&
    node.text === '' &&
    isOnlyTitle(editor.value.document),
}

const fixedCursorStyle = { float: 'left' }

export default ({ type, placeholder }) => {
  if (!['title', 'paragraph'].includes(type)) {
    throw new Error("type needs to be 'title' or 'paragraph'")
  }
  return PlaceholderPlugin({
    placeholder,
    when: whens[type],
    style: fixedCursorStyle,
  })
}
