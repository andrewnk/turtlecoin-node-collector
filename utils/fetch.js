// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import fetch from 'node-fetch'
const userAgent = 'Node Collector'

/**
 * Generic fetch function
 *
 * @param {string} url The url to fetch data from
 * @returns {Object} data The data retrieved from the url
 */
export const fetchData = async (url) => {
  const dataResponse = await fetch(url, {
    timeout: 10000,
    headers: {
      'User-Agent': userAgent
    }
  }).catch(err => {
    throw new Error(`Unable to fetch data from ${url}: ${err}`)
  })

  const data = dataResponse ? await dataResponse.json().catch(err => {
    throw new Error(`There was an error parsing the json for ${url}: ${err}`)
  }) : {}

  return data
}
