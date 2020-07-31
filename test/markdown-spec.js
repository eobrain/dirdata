import test from 'ava'
import fs from 'fs'
import markdown2json from '../markdown2json.js'

const { readFile } = fs.promises
// import passprint from 'passprint'
// const { pp } = passprint

test('spec', async t => {
  const spec = JSON.parse(await readFile('test/spec.json', 'utf8'))
  const expected = JSON.parse(await readFile('test/markdown-spec-expected.json', 'utf8'))

  for (const testCase of spec) {
    const expect = expected[testCase.example]
    if (expect) {
      const actual = markdown2json(testCase.markdown)
      t.deepEqual(actual, expect, `${testCase.example} ${testCase.section} \n-----\n${testCase.markdown}\n-----\n`)
    }
  }
})
