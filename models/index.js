// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import Sequelize from 'sequelize'
import { Node } from './node'
import { NodeData } from './nodeData'

/**
 * Model for the node table with fk node.id = node_data.node_id
 *
 * @params {Object} options DB options
 * @params {Winston} logger
 * @returns {Sequelize}
 */
export const db = (options, log) => {
  // if logging is enabled set up to use logger
  options.logging = options.debug === true ? sql => log.debug(sql) : false

  const sequelize = new Sequelize(options)

  // load model files
  const db = {
    Node: Node.init(sequelize),
    NodeData: NodeData.init(sequelize)
  }

  // load model associations
  for (const model of Object.keys(db)) {
    typeof db[model].associate === 'function' && db[model].associate(db)
  }

  db.sequelize = sequelize
  db.Sequelize = Sequelize

  return db
}
