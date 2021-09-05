#!/usr/bin/env node
import { start, prettifier } from './logger'
import Yargs from 'yargs/yargs'
import Helpers from 'yargs/helpers'

export interface PinoTinyOptions {
  hideIcons?: boolean
  hideLetters?: boolean
  hideTimestamp?: boolean
  hideColors?: boolean
  hideWeb?: boolean
  msgKey?: string
  filter?: (data: any) => any | undefined
}

function run (filter?: (data: any) => any | undefined): void {
  const argv = Yargs(Helpers.hideBin(process.argv)).options({
    i: { type: 'boolean', default: false, alias: 'hide-icons', description: 'Hide level emoji icons.' },
    l: { type: 'boolean', default: false, alias: 'hide-letters', description: 'Hide level letters.' },
    t: { type: 'boolean', default: false, alias: 'hide-timestamp', description: 'Hide the timestamp.' },
    c: { type: 'boolean', default: false, alias: 'hide-colors', description: 'Remove ansi colors from output.' },
    w: { type: 'boolean', default: false, alias: 'hide-web', description: 'Hide web stats.' },
    m: { type: 'string', default: 'msg', alias: 'msg-key', description: 'The key to use for message from the JSON log data.' }
  }).parseSync()
  const cliOptions: PinoTinyOptions = {
    hideIcons: argv.i,
    hideLetters: argv.l,
    hideTimestamp: argv.t,
    hideColors: argv.c,
    msgKey: argv.m,
    hideWeb: argv.w
  }
  if (filter != null) cliOptions.filter = filter
  start(cliOptions)
}

if (require.main === module) {
  run()
}

export const PinoTinyPrettifier = prettifier
export const Run = run
