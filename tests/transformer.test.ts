import Test from 'tape'
import { pre, post } from './utils'
import Through from 'through2'
import utils from '../src/utils'
import Transform from '../src/transformer'

Test('transformer.getStream happy path', (t): void => {
  const sandbox = pre()

  const formatStub = sandbox.stub(utils, 'dateFormat').returns('xxx')
  const objStub = sandbox.stub(Through, 'obj')
  const transformer = new Transform()
  transformer.getStream()
  objStub.callArgWith(0, { msg: 'test' }, 'utf8', (err: any, data: any) => {
    if (err != null) t.fail('fail')
    else {
      t.equal(data, '??? xxx test\n', 'entry is correct string')
      t.ok(formatStub.calledOnce, 'dateFormat() called once')
      post(sandbox)
      t.pass('success')
      t.end()
    }
  })
})

Test('transformer.getStream fail path', (t): void => {
  const sandbox = pre()

  sandbox.stub(utils, 'dateFormat').throws(new Error('error'))
  const objStub = sandbox.stub(Through, 'obj')
  const transformer = new Transform()
  transformer.getStream()
  objStub.callArgWith(0, { msg: 'test' }, 'utf8', (err: Error, data: any) => {
    if (err == null) t.fail('fail')
    else {
      t.equal(err.message, 'Unable to filter log: "{"msg":"test"}". error: error', 'throws error')
      post(sandbox)
      t.pass('success')
      t.end()
    }
  })
})

Test('transformer.createEntry happy path', (t): void => {
  const sandbox = pre()

  const formatStub = sandbox.stub(utils, 'dateFormat').returns('xxx')

  const transformer = new Transform()
  const result = transformer.createEntry({ msg: 'test', level: 10 })

  t.equal(result, 'TRC xxx test\n', 'entry is correct string')

  t.ok(formatStub.calledOnce, 'dateFormat() called once')

  post(sandbox)
  t.pass('success')
  t.end()
})

Test('transformer.createEntry no level path', (t): void => {
  const sandbox = pre()

  const formatStub = sandbox.stub(utils, 'dateFormat').returns('xxx')

  const transformer = new Transform()
  const result = transformer.createEntry({ msg: 'test' })

  t.equal(result, '??? xxx test\n', 'entry is correct string')

  t.ok(formatStub.calledOnce, 'dateFormat() called once')

  post(sandbox)
  t.pass('success')
  t.end()
})

Test('transformer.createEntry web req/res path', (t): void => {
  const sandbox = pre()

  const formatStub = sandbox.stub(utils, 'dateFormat').returns('xxx')

  const transformer = new Transform()
  const result = transformer.createEntry({
    msg: 'test',
    level: 30,
    req: { method: 'GET', url: 'test' },
    res: { statusCode: 200 },
    responseTime: 100
  })

  t.equal(result, 'INF xxx test GET test 200 100ms\n', 'entry is correct string')

  t.ok(formatStub.calledOnce, 'dateFormat() called once')

  post(sandbox)
  t.pass('success')
  t.end()
})

Test('transformer.createEntry web req/res (lite) path', (t): void => {
  const sandbox = pre()

  const formatStub = sandbox.stub(utils, 'dateFormat').returns('xxx')

  const transformer = new Transform()
  const result = transformer.createEntry({
    msg: 'test',
    level: 30,
    req: { method: 'GET', url: 'test' },
    res: { }
  })

  t.equal(result, 'INF xxx test GET test\n', 'entry is correct string')

  t.ok(formatStub.calledOnce, 'dateFormat() called once')

  post(sandbox)
  t.pass('success')
  t.end()
})
