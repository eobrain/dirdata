
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

const node2json = node => {
  const recurse = () => Array.from(children(node)).map(child => node2json(child))

  switch (node.type) {
    case 'text': return node.literal
    case 'softbreak': break
    case 'linebreak': break
    case 'emph': break
    case 'strong': break
    case 'html_inline': break
    case 'link': break
    case 'image': break
    case 'code': break
    case 'document': return recurse()
    case 'paragraph': return {
      p: recurse()
    }
    case 'block_quote': return {
      blockquote: recurse()
    }
    case 'item': return {
      li: recurse()
    }
    case 'list': return {
      [node.listType === 'bullet' ? 'ul' : 'ol']: recurse()
    }
    case 'heading':
      // result['H' + result.level] = node.firstChild.literal
      break
    case 'code_block': return {
      [node.type]: node.literal
    }
    case 'html_block': break
    case 'thematic_break': break
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
