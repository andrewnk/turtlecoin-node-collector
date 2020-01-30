// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import { fetch } from '../utils'

/**
 * Collect and save node data
 *
 * @export
 * @class NodeData
 */
export class NodeData {
  /**
   *Creates an instance of NodeData.
   * @param {Sequelize} db
   * @param {Winston} log
   * @memberof Node
   */
  constructor (db, log) {
    this.db = db
    this.log = log
  }

  /**
   * collector method
   *
   * @memberof Node
   * @returns {Array}
   */
  async collectNodeData () {
    const nodes = await this.db.Node.findAll({ raw: true })
    const results = await Promise.allSettled(nodes.map(node => this.getNodeData(node)))
    const rejects = results.filter(result => result.status === 'rejected')

    rejects.forEach(reject => {
      this.log.error(reject.reason)
    })

    return results.filter(result => result.status === 'fulfilled')
  }

  /**
   * Get the node data
   *
   * @param {Object} node
   * @memberof Node
   * @returns {Object}
   */
  async getNodeData (node) {
    const protocol = node.ssl ? 'https://' : 'http://'

    this.log.info(`Attempting to collect node data for ${node.name}`)

    const [nodeData, nodeFee] = await Promise.all([
      fetch(`${protocol}${node.url}:${node.port}/info`),
      fetch(`${protocol}${node.url}:${node.port}/fee`),
    ])

    return { ...node, ...nodeData, ...nodeFee }
  }

  /**
   * Save the node data
   *
   * @param {Array} nodeData
   * @memberof Node
   */
  async saveNodeData (nodeData) {
    // format for bulkCreate
    const formattedData = nodeData.map(node => {
      return {
        node_id: node.value.id,
        alt_blocks_count: node.value.alt_blocks_count,
        difficulty: node.value.difficulty,
        grey_peerlist_size: node.value.grey_peerlist_size,
        hashrate: node.value.hashrate,
        height: node.value.height,
        incoming_connections_count: node.value.incoming_connections_count,
        last_known_block_index: node.value.last_known_block_index,
        major_version: node.value.major_version,
        minor_version: node.value.minor_version,
        network_height: node.value.network_height,
        outgoing_connections_count: node.value.outgoing_connections_count,
        start_time: node.value.start_time,
        status: node.value.status === 'OK' ? node.value.status : 'Unreachable',
        supported_height: node.value.supported_height,
        synced: node.value.synced,
        tx_count: node.value.tx_count,
        tx_pool_size: node.value.tx_pool_size,
        version: node.value.version,
        white_peerlist_size: node.value.white_peerlist_size,
        is_cache_api: node.value.isCacheApi || false,
        fee_address: node.value.address,
        fee_amount: node.value.amount
      }
    })

    const insertedRecords = await this.db.NodeData.bulkCreate(formattedData, { returning: true })

    if(insertedRecords.length > 0) {
      insertedRecords.forEach(async record => {
        const node = await this.db.Node.findByPk(record.node_id, {
          attributes: ['name']
        })

        this.log.info(`Node data added to the database for ${node.name}`)
      })

      return
    }

    this.log.error(`There was a problem saving the node data for ${nodeData.name}`)
  }
}
