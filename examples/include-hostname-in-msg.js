// alter msg it include hostname

const { start } = require('pino-tiny')

function filter (data) {
  return { ...data, msg: `[${data.hostname}] ${data.msg}` }
}

start(filter)
