// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import { Sequelize } from 'sequelize'

/**
 * Model for the node_data table with fk node_data.node_id = node.id
 *
 * @export
 * @class NodeData
 * @extends {Sequelize.Model}
 */
export class NodeData extends Sequelize.Model {
  static init (sequelize) {
    return super.init(
      {
        time: {
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          primaryKey: true,
          type: Sequelize.TIME()
        },
        node_id:  {
          primaryKey: true,
          allowNull: false,
          type: Sequelize.INTEGER()
        },
        alt_blocks_count: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        difficulty: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        gray_peerlist_size: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        hashrate: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        height: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        incoming_connections_count: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        last_known_block_index: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        major_version: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        minor_version: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        network_height: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        outgoing_connections_count: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        start_time: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        status: {
          allowNull: false,
          defaultValue: 'Unreachable',
          type: Sequelize.STRING()
        },
        supported_height: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        synced: {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.BOOLEAN()
        },
        testnet: {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.BOOLEAN()
        },
        tx_count: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        tx_pool_size: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        version: {
          allowNull: false,
          defaultValue: '0',
          type: Sequelize.STRING()
        },
        white_peerlist_size: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.BIGINT()
        },
        is_cache_api: {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.BOOLEAN()
        },
        fee_address: {
          allowNull: false,
          defaultValue: '',
          type: Sequelize.STRING()
        },
        fee_amount: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.DECIMAL()
        }
      },
      {
        tableName: 'node_data',
        charset: 'latin1',
        engine: 'InnoDB',
        rowFormat: 'COMPRESSED',
        timestamps: false,
        sequelize
      }
    )
  }

  static associate (models) {
    this.Node = this.belongsTo(models.Node, { as: 'node_data', foreignKey: 'node_id', targetKey: 'id' })
  }
}
