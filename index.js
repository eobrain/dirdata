import fs from 'fs'
import toml from 'toml'
import yaml from 'js-yaml'
// import passprint from 'passprint'
// const { pp } = passprint

const { stat, readdir, readFile } = fs.promises

export const merged = async dir => {
  const result = {}
  for (const child of await readdir(dir)) {
    const childPath = dir + '/' + child
    const stats = await stat(childPath)
    const add = async (suffix, parser) => {
      const data = parser(await readFile(childPath, 'utf8'))
      result[child.replace(suffix, '')] = { data }
    }
    if (stats.isDirectory()) {
      // Recursively call
      result[child] = await merged(childPath)
    } else if (child.endsWith('.json')) {
      add('.json', JSON.parse)
    } else if (child.endsWith('.yaml')) {
      add('.yaml', yaml.safeLoad)
    } else if (child.endsWith('.toml')) {
      add('.toml', toml.parse)
    } else {
      result[child] = { path: childPath }
    }
  }
  return result
}
