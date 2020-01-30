// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import { fetch, validation } from '../utils'

/**
 * Collect and save nodes
 *
 * @export
 * @class Node
 */
export class Node {
  /**
   *Creates an instance of Node.
   * @param {Seuqelize} db
   * @param {Winston} log
   * @memberof Node
   */
  constructor (db, log) {
    this.db = db
    this.log = log
  }

  /**
   * Gets nodes then validates
   *
   * @param {Array|Object|string} nodesSource The source of the nodes
   * @returns {Object|Array} Array of validated node objects or single validated node object
   * @memberof Node
   */
  async collectNodes (nodesSource) {
    const nodes = await this.getNodes(nodesSource)

    await this.validateNodes(nodes)

    this.log.info('Successfully loaded nodes')
    return nodes
  }

  /**
   * Gets nodes given a source (object, array of objects, or url).
   *
   * @param {Array|Object|string} nodesSource The source of the nodes
   * @returns {Object|Array} Array of node objects or node object
   * @memberof Node
   */
  async getNodes (nodesSource) {
    let nodes = nodesSource
    const nodeSourceType = Object.prototype.toString.call(nodesSource)

    if(nodeSourceType.indexOf('Object') > -1) {
      nodes = [ nodesSource ]
    } else if (nodeSourceType.indexOf('String') > -1) {
      // if it is a string assume it's a url
      nodes = await this.getNodesFromURL(nodesSource)
    }

    return nodes
  }

  /**
   * Queries URL and retrieves nodes JSON
   *
   * @param {string} nodeUrl Url to get nodes from
   * @returns {Array} Array of node objects
   * @memberof Node
   */
  async getNodesFromURL (nodeUrl) {
    this.log.info(`Attempting to collect node/s from ${nodeUrl}`)

    if(!validation.isUrl(nodeUrl)) {
      throw TypeError('You must supply a valid URL')
    }

    const nodes = await fetch(nodeUrl)

    if(!Object.prototype.hasOwnProperty.call(nodes, 'nodes')) {
      throw 'The json does not have the correct structure'
    }

    return nodes.nodes
  }

  /**
   * Validates nodes against specific rules
   *
   * @param {Array} nodes Array of nodes to validate
   * @returns {Promise}
   * @memberof Node
   */
  validateNodes (nodes) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(nodes)) {
        nodes.forEach(node => {
          if(!validation.validateNode(node)) {
            reject('There was a problem validating the nodes; please correct the errors above ^')
          }
        })
      } else {
        reject('Nodes must either be formatted as an array of objects or a single object')
      }

      resolve()
    })
  }

  /**
   * Loops through array of node objects and saves
   *
   * @param {Array} nodes Array of nodes
   * @memberof Node
   */
  async saveNodes (nodes) {
    this.log.info('Attempting to save the nodes')

    for (const node of nodes) {
      await this.saveNode(node)
    }

    return
  }

  /**
   * Saves the node to the database
   *
   * @param {Object} node Node object to save
   * @memberof Node
   */
  async saveNode (node) {
    const created = await this.db.Node.findOrCreate({
      where: {
        name: node.name
      },
      defaults: {
        name: node.name,
        url: node.url,
        port: node.port,
        cache: node.cache,
        ssl: node.ssl
      }
    })

    if(created[1]) {
      this.log.info(`Node added to the database: ${node.name}`)
    }
  }
}
