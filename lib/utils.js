function parse (line) {
  try {
    const output = JSON.parse(line)
    output.parsed = true
    return output
  } catch (err) {
    return {
      level: 30,
      parsed: false,
      time: Date.now(),
      tags: ['info'],
      msg: line
    }
  }
}

function noop (x) { return x }

module.exports = { noop, parse }
