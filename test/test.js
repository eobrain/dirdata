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
