import Split from 'split2'
import Through from 'through2'
import Pump from 'pump'
import Files from 'fs'
import Chalk from 'chalk'
import DateFormat from 'dateformat'
import { PinoTinyOptions } from '.'
import StripAnsi from 'strip-ansi'

interface Level {
  letters: string
  icon: string
  color: Chalk.Chalk
}

interface Levels {[key: number]: Level}

const levels: Levels = {
  10: { letters: 'TRC', icon: ' 🔎', color: Chalk.rgb(128, 128, 128) },
  20: { letters: 'DBG', icon: ' 🪲 ', color: Chalk.rgb(255, 255, 0) },
  30: { letters: 'INF', icon: ' ℹ️ ', color: Chalk.rgb(0, 255, 0) },
  40: { letters: 'WRN', icon: ' ⚠️ ', color: Chalk.rgb(255, 128, 0) },
  50: { letters: 'ERR', icon: ' 🔥', color: Chalk.rgb(255, 0, 0) },
  60: { letters: 'FTL', icon: ' 💣', color: Chalk.bgRgb(255, 0, 0).white }
}

const unknown: Level = { letters: '???', icon: ' 🤷‍', color: Chalk.rgb(128, 128, 128) }

export function start (options: PinoTinyOptions): void {
  const thru = Through.obj(callback(options))
  const parser = Split(parse)
  Pump(process.stdin, parser, thru, process.stdout).on('error', console.error)

  // https://github.com/pinojs/pino/pull/358
  /* istanbul ignore next */
  if (!process.stdin.isTTY && !Files.fstatSync(process.stdin.fd).isFile()) {
    process.once('SIGINT', function noOp () { console.log() /* print a line after ^C */ })
  }
}

export function prettifier (options: PinoTinyOptions): any {
  return () => {
    return (data: any) => {
      const entry = typeof data === 'string' ? parse(data) : data
      return format(entry, options) ?? ''
    }
  }
}

export function parse (line: string): any {
  try {
    const output = JSON.parse(line)
    return output
  } catch (err) {
    return {
      level: 30,
      time: Date.now(),
      tags: ['info'],
      msg: line
    }
  }
}

export function format (data: any, options: PinoTinyOptions = {}): string | undefined {
  if (options.filter != null) {
    data = options.filter(data)
  }
  if (data == null) return

  const parts: string[] = []
  const level: Level = levels[data.level] ?? unknown

  if (!(options.hideLetters ?? false)) {
    const prefix: string[] = [level.letters]
    if ((!(options.hideIcons ?? false))) {
      prefix.push(level.icon)
    }
    parts.push(level.color(prefix.join(' ')))
  }

  if (!(options.hideTimestamp ?? false)) {
    parts.push(Chalk.dim(DateFormat(data.time, 'HH:mm:ss.l')))
  }

  parts.push(data.msg)

  if (!(options.hideTimestamp ?? false) && data.res != null && data.req != null) {
    parts.push(Chalk.dim(`${data.req.method as string} ${data.req.url as string} (${data.res.statusCode as string}${data.responseTime != null ? `/${(data.responseTime as number).toLocaleString()}ms` : ''})`))
  }

  const output = `${parts.join(' ')}\n`
  return options.hideColors ?? false ? StripAnsi(output) : output
}

export function callback (options: PinoTinyOptions): (input: any, enc: unknown, cb: (error?: any, result?: any) => void) => void {
  return (input, _enc, cb) => {
    try {
      cb(null, format(input, options))
    } catch (err: any) {
      cb(new Error(`Unable to process log: "${JSON.stringify(input)}". error: ${err.message as string}`))
    }
  }
}
