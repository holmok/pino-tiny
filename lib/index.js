#!/usr/bin/env node

const Minimist = require('minimist')
const { start } = require('./logger')

if (require.main === module) {
  const args = Minimist(process.argv.slice(2))
  start(args)
} else {
  module.exports = { start }
}
