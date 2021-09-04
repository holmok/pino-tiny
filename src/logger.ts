import Split from 'split2'
import Through from 'through2'
import Pump from 'pump'
import Files from 'fs'
import Chalk from 'chalk'
import DateFormat from 'dateformat'

interface Level {
  prefix: string
  color: Chalk.Chalk
}

interface Levels {[key: number]: Level}

const levels: Levels = {
  10: { prefix: 'TRC 🔎', color: Chalk.rgb(128, 128, 128) },
  20: { prefix: 'DBG 🪲 ', color: Chalk.rgb(255, 255, 0) },
  30: { prefix: 'INF ℹ️ ', color: Chalk.rgb(0, 255, 0) },
  40: { prefix: 'WRN ⚠️ ', color: Chalk.rgb(255, 128, 0) },
  50: { prefix: 'ERR 🔥', color: Chalk.rgb(255, 0, 0) },
  60: { prefix: 'FTL 💣', color: Chalk.bgRgb(255, 0, 0).white }
}

export function start (): void {
  const thru = Through.obj(callback())
  const parser = Split(parse)
  Pump(process.stdin, parser, thru, process.stdout).on('error', console.error)

  // https://github.com/pinojs/pino/pull/358
  /* istanbul ignore next */
  if (!process.stdin.isTTY && !Files.fstatSync(process.stdin.fd).isFile()) {
    process.once('SIGINT', function noOp () { console.log() /* print a line after ^C */ })
  }
}

export function prettifier (): any {
  return (options: any) => {
    const key = options.msg
    return (data: any) => {
      const entry = typeof data === 'string' ? parse(data) : data
      return format(entry, key) ?? ''
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

export function format (data: any, key: string = 'msg'): string | undefined {
  const isWeb = data.res != null && data.req != null
  const level = levels[data.level]
  const prefix = level != null ? level.color(level.prefix) : Chalk.grey('????')
  const web = isWeb ? `${data.req.method as string} ${data.req.url as string} (${data.res.statusCode as string}${data.responseTime != null ? `/${(data.responseTime as number).toLocaleString()}ms` : ''})` : ''
  const msg: string = data[key] ?? Chalk.grey(JSON.stringify(data))
  const output = `${prefix} ${Chalk.dim(DateFormat(data.time, 'HH:mm:ss.l'))} ${msg} ${Chalk.dim(web)}\n`
  return output
}

export function callback (): (input: any, enc: unknown, cb: (error?: any, result?: any) => void) => void {
  return (input, _enc, cb) => {
    try {
      cb(null, format(input))
    } catch (err: any) {
      cb(new Error(`Unable to process log: "${JSON.stringify(input)}". error: ${err.message as string}`))
    }
  }
}
