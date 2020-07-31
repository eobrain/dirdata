import test from 'ava'
import fs from 'fs'
import { merged } from '../index.js'
const { readFile } = fs.promises
// import passprint from 'passprint'
// const { pp } = passprint

test('json', async t => {
  const actual = await merged('test/json')
  const expected = JSON.parse(await readFile('test/json-expected.json', 'utf8'))

  t.deepEqual(actual, expected)
})

test('tomltap', async t => {
  const actual = await merged('test/toml')
  const expected = JSON.parse(await readFile('test/json-expected.json', 'utf8'))

  t.deepEqual(actual, expected)
})

test('yaml', async t => {
  const actual = await merged('test/yaml')
  const expected = JSON.parse(await readFile('test/json-expected.json', 'utf8'))

  t.deepEqual(actual, expected)
})

test('files', async t => {
  const actual = await merged('test/files')
  const expected = JSON.parse(await readFile('test/files-expected.json', 'utf8'))

  t.deepEqual(actual, expected)
})

test('top-level-array', async t => {
  const actual = await merged('test/top-level-array')
  const expected = JSON.parse(await readFile('test/top-level-array-expected.json', 'utf8'))

  t.deepEqual(actual, expected)
})

/* test('markdown', async t => {
  const actual = await merged('test/markdown')
  const expected = JSON.parse(await readFile('test/markdown-expected.json', 'utf8'))

  t.deepEqual(actual, expected)
}) */
