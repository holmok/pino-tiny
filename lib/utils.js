const debug = require('debug')('pino-tiny:utils')

function parse (line) {
  try {
    const output = JSON.parse(line)
    output.parsed = true
    return output
  } catch (err) {
    return {
      level: 30,
      parsed: false,
      time: Date.now(),
      tags: ['info'],
      msg: line
    }
  }
}
function shutdown (reason, exit) {
  debug('logging stopped: %s', reason)
  /* istanbul ignore if */
  if (typeof exit === 'undefined' || exit) { // this is so it does not kill unit test
    process.exit(0)
  }
}
function noop (x) { return x }

module.exports = { noop, shutdown, parse }
