const Tape = require('tape')
const MockDate = require('mockdate')

function pre () {
  const utils = require('../lib/utils')
  const now = Date.now()
  MockDate.set(now)
  return { utils, now }
}

function post (ctx) {
  MockDate.reset()
}
Tape('parse, good JSON', (t) => {
  const ctx = pre()
  const expected = { bool: true, string: 'a', object: { number: 1 }, parsed: true }
  const string = JSON.stringify(expected)
  const result = ctx.utils.parse(string)
  t.deepEquals(result, expected, 'objects match just fine.')
  post(ctx)
  t.end()
})

Tape('parse, not JSON', (t) => {
  const ctx = pre()
  const expected = { level: 30, parsed: false, tags: ['info'], msg: 'test', time: ctx.now }
  const result = ctx.utils.parse('test')
  t.deepEquals(result, expected, 'objects match just fine.')
  post(ctx)
  t.end()
})

Tape('noop', (t) => {
  const ctx = pre()
  const expected = { test: true }
  const result = ctx.utils.noop(expected)
  t.deepEquals(result, expected, 'objects match just fine.')
  post(ctx)
  t.end()
})
