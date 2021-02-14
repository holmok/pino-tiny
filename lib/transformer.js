const debug = require('debug')('pino-tiny:transformer')
const Moment = require('moment')
const Chalk = require('chalk')
const levels = {
  10: { icon: 'TRC', color: Chalk.rgb(128, 128, 128) },
  20: { icon: 'DBG', color: Chalk.rgb(255, 255, 0) },
  30: { icon: 'INF', color: Chalk.rgb(0, 255, 0) },
  40: { icon: 'WRN', color: Chalk.rgb(255, 128, 0) },
  50: { icon: 'ERR', color: Chalk.rgb(255, 0, 0) },
  60: { icon: 'FTL', color: Chalk.rgb(128, 0, 0) }
}
function getTransform (filter) {
  return (data, enc, cb) => {
    let result
    try {
      result = filter(data)
      if (!result) {
        debug('Skipping log(%o)', data)
        cb()
      } else {
        const web =
          result.res && result.req
            ? `${result.req.method} ${result.req.url} (${
                result.res.statusCode
              }${result.responseTime ? `/${result.responseTime}ms` : ''})`
            : ''
        const icon = levels[result.level]
          ? levels[result.level].color(levels[result.level].icon)
          : '???'
        const output = `${icon} ${Moment(result.time).format('HH:mm:ss.SSS')} ${
          result.msg
        } ${Chalk.dim(web)}\n`
        cb(null, output)
      }
    } catch (err) {
      result = false
      cb(
        new Error(
          `Unable to filter log: "${JSON.stringify(data)}". error: ${
            err.message
          }`
        )
      )
    }
  }
}

module.exports = { getTransform }
