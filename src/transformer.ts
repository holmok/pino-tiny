import { Transform } from 'stream'
import Through from 'through2'
import Chalk from 'chalk'
import utils from './utils'

const LEVELS: {[key: number]: {icon: string, color: Chalk.Chalk}} = {
  10: { icon: 'TRC', color: Chalk.rgb(128, 128, 128) },
  20: { icon: 'DBG', color: Chalk.rgb(255, 255, 0) },
  30: { icon: 'INF', color: Chalk.rgb(0, 255, 0) },
  40: { icon: 'WRN', color: Chalk.rgb(255, 128, 0) },
  50: { icon: 'ERR', color: Chalk.rgb(255, 0, 0) },
  60: { icon: 'FTL', color: Chalk.rgb(128, 0, 0) }
}

export default class Transformer {
  private getWebInfo (data: any): string {
    if (data.req == null || data.res == null) return ''
    let output = ` ${data.req.method as string} ${data.req.url as string}`
    if (data.res.statusCode != null) output = `${output} ${data.res.statusCode as string}`
    if (data.responseTime != null) output = `${output} ${data.responseTime as string}ms`
    return Chalk.dim(output)
  }

  private getIconInfo (level: number): string {
    if (LEVELS[level] == null) return '???'
    return LEVELS[level].color(LEVELS[level].icon)
  }

  createEntry (data: any): string {
    const web = this.getWebInfo(data)
    const icon = this.getIconInfo(data.level)
    const timestamp = utils.dateFormat(Date.now(), 'HH:mm:ss.l')
    return `${icon} ${timestamp} ${data.msg as string}${web}\n`
  }

  getStream (): Transform {
    return Through.obj(
      (data, enc, cb) => {
        try {
          const output = this.createEntry(data)
          cb(null, output)
        } catch (err) {
          cb(
            new Error(`Unable to filter log: "${JSON.stringify(data)}". error: ${err.message as string}`)
          )
        }
      }
    )
  }
}
