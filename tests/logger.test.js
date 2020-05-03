const Tape = require('tape')
const Proxyquire = require('proxyquire')
  .noPreserveCache()
  .noCallThru()

const Sinon = require('sinon')

function pre () {
  const sanbox = Sinon.createSandbox()

  const proxies = {
    though2: { obj () {} },
    transformer: { getTransform () {} },
    utils: {}
  }

  const stubs = {
    pump: sanbox.stub(),
    split: sanbox.stub()
  }
  const logger = Proxyquire('../lib/logger', {
    split2: stubs.split,
    though2: proxies.though2,
    pump: stubs.pump,
    './transformer': proxies.transformer,
    './utils': proxies.utils
  })

  return { logger, sanbox, proxies, stubs }
}

function post (ctx) {
  ctx.sanbox.verifyAndRestore()
}

Tape('logger.start, is good', (t) => {
  const ctx = pre()
  ctx.sanbox.stub(ctx.proxies.though2, 'obj').returns()
  ctx.sanbox.stub(ctx.proxies.transformer, 'getTransform').returns()
  ctx.stubs.split.returns()
  ctx.stubs.pump.returns({ on () {} })
  ctx.logger.start({ exit: false })
  post(ctx)
  t.end()
})
