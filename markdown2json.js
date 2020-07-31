
import commonmark from 'commonmark'
import passprint from 'passprint'
const { pp } = passprint

function * children (node) {
  for (let child = node.firstChild; child; child = child.next) {
    yield child
  }
}

const viewAST = node => {
  const result = {}
  result.type = node.type
  if (node.literal) {
    result.literal = node.literal
  }
  if (node.destination) {
    result.destination = node.destination
  }
  if (node.title) {
    result.title = node.title
  }
  if (node.destination) {
    result.destination = node.destination
  }
  if (node.info) {
    result.info = node.info
  }
  if (node.level) {
    result.level = node.level
  }
  if (node.listType) {
    result.listType = node.listType
  }
  if (node.firstChild) {
    result.children = []
    for (const child of children(node)) {
      result.children.push(viewAST(child))
    }
  }

  return result
}

const mergeText = a => {
  let text
  const result = []
  for (const child of a) {
    if (typeof child === 'string') {
      if (text === undefined) {
        text = child
      } else {
        text += child
      }
    } else {
      if (text !== undefined) {
        result.push(text)
        text = undefined
      }
      result.push(child)
    }
  }
  if (text !== undefined) {
    result.push(text)
  }
  return result
}

const node2json = node => {
  const recurse = () => mergeText(Array.from(children(node)).map(child => node2json(child)))

  switch (node.type) {
    case 'text': return node.literal
    case 'softbreak':return '\n'
    case 'linebreak': break
    case 'emph': return { em: recurse() }
    case 'link': return {
      href: node.destination,
      title: node.title,
      a: recurse()
    }
    case 'image': break
    case 'document': return recurse()
    case 'paragraph': return { p: recurse() }
    case 'block_quote': return { blockquote: recurse() }
    case 'item': return { li: recurse() }
    case 'list': return {
      [node.listType === 'bullet' ? 'ul' : 'ol']: recurse()
    }
    case 'heading':return { ['h' + node.level]: recurse() }

    case 'strong':
      return { [node.type]: recurse() }

    case 'code':
    case 'code_block':
      return { [node.type]: node.literal }

    case 'html_inline':
    case 'html_block':
      return { error: 'raw HTML not allowed' }

    case 'thematic_break':return { hr: true }
    default:
      throw new Error('Unexpected node type ' + node.type)
  }
  return 'UNHANDLED ' + node.type + ' ' + JSON.stringify(viewAST(node), null, ' ')
}

export default md => {
  const reader = new commonmark.Parser()
  const node = reader.parse(md)
  console.warn('AST=', JSON.stringify(viewAST(node), null, ' '))
  return node2json(node)
}
