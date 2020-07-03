const debug = require('debug')('pino-tiny:logger')
const Split = require('split2')
const Through = require('through2')
const Pump = require('pump')
const Fs = require('fs')

const { getTransform } = require('./transformer')
const { parse, noop } = require('./utils')

function start (options) {
  debug('logging started')
  const { filter } = options
  const transformer = Through.obj(getTransform(filter || noop))
  const parser = Split(parse)
  Pump(process.stdin, parser, transformer, process.stdout).on('error', console.error)

  // https://github.com/pinojs/pino/pull/358
  /* istanbul ignore next */
  if (!process.stdin.isTTY && !Fs.fstatSync(process.stdin.fd).isFile()) {
    process.once('SIGINT', function noOp () { console.log() /* print a line after ^C */ })
  }
}

module.exports = { start }
