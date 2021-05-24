#!/usr/bin/env node
import Logger from './logger'

export const logger = new Logger()

if (require.main === module) {
  logger.start(process.stdin, process.stdout)
} else {
  module.exports = Logger
}
