// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const { Collector } = require('turtlecoin-node-collector')

// load nodes from url
const nodes = 'https://raw.githubusercontent.com/turtlecoin/turtlecoin-nodes-json/master/turtlecoin-nodes.json'

const options = {
  db: {
    database: process.env.DB_NAME,
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  },
  resetDatabase: false,
  debug: false,
  nodes: nodes
}

const collector = new Collector(options)
collector.start()