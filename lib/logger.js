const debug = require('debug')('pino-tiny:logger')
const Split = require('split2')
const Through = require('through2')
const Pump = require('pump')

const { getTransform } = require('./transformer')
const { parse, noop, shutdown } = require('./utils')

function start (options) {
  debug('logging started')
  const { exit, filter } = options
  const transformer = Through.obj(getTransform(filter || noop))
  const parser = Split(parse)
  Pump(process.stdin, parser, transformer, process.stdout).on('error', console.error)
  /* istanbul ignore next */
  process.stdin.on('end', () => shutdown('input ended', exit))
  /* istanbul ignore next */
  process.on('SIGINT', () => shutdown('SIGINT', exit))
  /* istanbul ignore next */
  process.on('SIGTERM', () => shutdown('SIGTERM', exit))
}

module.exports = { start }
