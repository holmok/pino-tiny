// this implementation will filter out
// all but object log entries (filtering
// out string output)

const { start } = require('pino-tiny')

function filter (data) {
  return typeof data === 'object' ? data : false
}

start(filter)
