const Tape = require('tape')

function pre () {
  const transformer = require('../lib/transformer')
  return { transformer }
}

function post (ctx) {}

Tape('log, is good', (t) => {
  const ctx = pre()
  const trnsfrm = ctx.transformer.getTransform((i) => i)
  const data = { msg: 'hello', time: Date().now, level: 30 }
  trnsfrm(data, null, function cb (err, response) {
    t.notok(err, 'no error')
    t.ok(response, 'logged')
    t.ok(response.indexOf('INF') === 0, 'starts with inf')
    t.ok(response.indexOf('hello') > 0, 'has hello')
    post(ctx)
    t.end()
  })
})

Tape('log, is good with custom levels', (t) => {
  const ctx = pre()
  const trnsfrm = ctx.transformer.getTransform((i) => i)
  const data = { msg: 'hello', time: Date().now, level: 31 }
  trnsfrm(data, null, function cb (err, response) {
    t.notok(err, 'no error')
    t.ok(response, 'logged')
    t.ok(response.indexOf('???') === 0, 'starts with ???')
    t.ok(response.indexOf('hello') > 0, 'has hello')
    post(ctx)
    t.end()
  })
})
Tape('log, is filtered', (t) => {
  const ctx = pre()
  const trnsfrm = ctx.transformer.getTransform((i) => false)
  const data = { msg: 'hello', time: Date().now, level: 30 }
  trnsfrm(data, null, function cb (err, response) {
    t.notok(err, 'no error')
    t.notok(response, 'nothing logged')
    post(ctx)
    t.end()
  })
})

Tape('log, is webby', (t) => {
  const ctx = pre()
  const trnsfrm = ctx.transformer.getTransform((i) => i)
  const data = {
    msg: 'hello',
    time: ctx.now,
    level: 30,
    res: { statusCode: 401 },
    req: { method: 'GET', url: '/home' }
  }
  trnsfrm(data, null, function cb (err, response) {
    t.notok(err, 'no error')
    t.ok(response, 'logged')
    t.ok(response.indexOf('INF') === 0, 'starts with inf')
    t.ok(response.indexOf('GET /home (401)') > 0, 'has web info')
    post(ctx)
    t.end()
  })
})

Tape('log, filter throws', (t) => {
  const ctx = pre()
  const trnsfrm = ctx.transformer.getTransform((i) => { throw new Error() })
  const data = { msg: 'hello', time: Date().now, level: 30 }
  trnsfrm(data, null, function cb (err, response) {
    t.ok(err, 'got error')
    t.notok(response, 'nothing logged')
    post(ctx)
    t.end()
  })
})
