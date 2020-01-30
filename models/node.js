// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import { Sequelize } from 'sequelize'

/**
 * Model for the node table with fk node.id = node_data.node_id
 *
 * @export
 * @class Node
 * @extends {Sequelize.Model}
 */
export class Node extends Sequelize.Model {
  static init (sequelize) {
    return super.init(
      {
        id: {
          primaryKey: true,
          autoIncrement: true,
          type: Sequelize.INTEGER()
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING(255)
        },
        port: {
          allowNull: false,
          type: Sequelize.INTEGER()
        },
        url: {
          allowNull: false,
          type: Sequelize.TEXT()
        },
        ssl: {
          allowNull: false,
          type: Sequelize.BOOLEAN()
        },
        cache: {
          allowNull: false,
          type: Sequelize.BOOLEAN()
        }
      },
      {
        tableName: 'node',
        charset: 'latin1',
        engine: 'InnoDB',
        rowFormat: 'COMPRESSED',
        timestamps: false,
        sequelize
      }
    )
  }

  static associate (models) {
    this.NodeData = this.hasMany(models.NodeData, { foreignKey: 'node_id', sourceKey: 'id'})
  }
}
