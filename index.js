import fs from 'fs'
// import passprint from 'passprint'
// const { pp } = passprint

const { stat, readdir, readFile } = fs.promises

export const merged = async path => {
  const stats = await stat(path)
  if (stats.isDirectory()) {
    // Recursively call children
    const result = {}
    for (const child of await readdir(path)) {
      result[child] = await merged(path + '/' + child)
    }
    return result
  }

  return JSON.parse(await readFile(path, 'utf8'))
}
