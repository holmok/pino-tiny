import Transformer from './transformer'
import Fs from 'fs'
import { ReadStream, WriteStream } from 'tty'
import utils from './utils'

function parse (line: any): any {
  try {
    return typeof line === 'string' ? JSON.parse(line) : line
  } catch (err) {
    return {
      level: 30,
      time: Date.now(),
      tags: ['info'],
      msg: line
    }
  }
}

export default class Logger {
  prettier (): (options: any) => string {
    const transformer = new Transformer()
    return (data) => transformer.createEntry(parse(data))
  }

  start (streamIn: ReadStream, streamOut: WriteStream): void {
    const transformer = new Transformer()
    const parser = utils.split(parse)
    utils.pump(process.stdin, parser, transformer.getStream(), process.stdout).on('error', console.error)
    // https://github.com/pinojs/pino/pull/358
    /* istanbul ignore next */
    if (!process.stdin.isTTY && !Fs.fstatSync(process.stdin.fd).isFile()) {
      process.once('SIGINT', function sigInt () { console.log() /* print a line after ^C */ })
    }
  }
}
