// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import winston from 'winston'
const colorizer = winston.format.colorize()

/**
 * Winston logger with colorizer
 *
 * @param {boolean} debug
 * @returns {Winston} log The winston logger
 */
export const log = (debug) => winston.createLogger({
  level: debug ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.printf(msg => colorizer.colorize(msg.level, `${msg.timestamp}: [${msg.level}]: ${msg.message}`))
  ),
  transports: [
    new winston.transports.Console()
  ]
})
