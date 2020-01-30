// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const { Collector } = require('turtlecoin-node-collector')

// load a single node from an object
const nodes = {
  name: "greywolf Germany",
  url: "turtlenode.co",
  port: 11898,
  ssl: false,
  cache: false
}

const options = {
  db: {
    dialect: 'sqlite',
    storage: '/db/nodes.db'
  },
  resetDatabase: false,
  debug: false,
  nodes: nodes
}

const collector = new Collector(options)
collector.start()