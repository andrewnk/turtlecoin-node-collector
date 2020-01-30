// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import { setIntervalAsync } from 'set-interval-async/dynamic'
import { Node } from './node'
import { NodeData } from './nodeData'
import { db } from '../models'
import { log } from '../utils'

/**
 * Collects and saves nodes and node data
 *
 * @export
 * @class Collector
 */
export class Collector {
  /**
   *Creates an instance of Collector.
   * @param {Object} options
   * @memberof Collector
   */
  constructor (options) {
    this.debug = options.debug || false
    options.db.debug = this.debug
    this.resetDatabase = options.resetDatabase || false
    this.nodesSource = options.nodes
    this.log = log(this.debug)
    this.db = db(options.db, this.log)
    this.node = new Node(this.db, this.log)
    this.nodeData = new NodeData(this.db, this.log)
  }

  /**
   * Initialize and sync to the db
   *
   * @memberof Collector
   */
  async init () {
    // connect to the database
    await this.db.sequelize.authenticate().catch(err => {
      throw new Error(`There was an error connecting to the database: ${err}`)
    })

    this.log.info('Connected to the database')

    // synchronize with the database
    await this.db.sequelize.sync({ force: this.resetDatabase }).catch(err => {
      throw new Error(`There was an error syncing with the database: ${err}`)
    })

    this.log.info('Synced to the database')
  }

  /**
   * Collect and save nodes
   *
   * @memberof Collector
   */
  async collectNodes () {
    const nodes = await this.node.collectNodes(this.nodesSource).catch(err => {
      throw new Error(err)
    })

    await this.node.saveNodes(nodes).catch(err => {
      throw new Error(err)
    })
  }

  /**
   * Collect and save node data
   *
   * @memberof Collector
   */
  async collectNodeData () {
    const nodeData = await this.nodeData.collectNodeData().catch(err => {
      throw new Error(err)
    })

    await this.nodeData.saveNodeData(nodeData).catch(err => {
      throw new Error(err)
    })
  }

  /**
   * Collect nodes every 12 hours and node data every 20 seconds
   *
   * @memberof Collector
   */
  async start () {
    await this.init().catch(err => {
      throw new Error(err)
    })

    await this.collectNodes().catch(err => {
      this.log.error(err)
    })

    // loop every 12 hours
    setIntervalAsync(
      async () => {
        await this.collectNodes().catch(err => {
          this.log.error(err)
        })
      },
      43200000
    )

    await this.collectNodeData().catch(err => {
      this.log.error(err)
    })

    // loop every 30 seconds
    setIntervalAsync(
      async () => {
        await this.collectNodeData().catch(err => {
          this.log.error(err)
        })
      },
      30000
    )
  }
}
