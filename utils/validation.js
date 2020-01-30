// Copyright (c) 2020, andrewnk, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import { log } from './log'
const logger = log(false)

/**
 * Checks that the property has a length greater than 0
 *
 * @param {*} prop
 * @returns {boolean} error.result The result of the validation test
 * @returns {string} error.message The error message associated with test
 */
export const isValidLength = prop => {
  return {
    result: prop.length > 0,
    message: `${prop} does not have a valid length`
  }
}

/**
 * Checks that the property is a number greater than 0
 *
 * @param {number} prop
 * @returns {boolean} error.result The result of the validation test
 * @returns {string} error.message The error message associated with test
 */
export const isNumber = prop => {
  return {
    result: getType(prop).indexOf('Number') > -1,
    message: `${prop} is not a number`
  }
}

/**
 * Checks that the property is boolean
 *
 * @param {boolean} prop
 * @returns {boolean} error.result The result of the validation test
 * @returns {string} error.message The error message associated with test
 */
export const isBoolean = prop => {
  return {
    result: getType(prop).indexOf('Boolean') > -1,
    message: `${prop} is not a boolean`
  }
}

/**
 * Checks that the property is a string
 *
 * @param {string} prop
 * @returns {boolean} error.result The result of the validation test
 * @returns {string} error.message The error message associated with test
 */
export const isString = prop => {
  return {
    result: getType(prop).indexOf('String') > -1,
    message: `${prop} is not a string`
  }
}

/**
 * Checks that the property is a valid URL
 *
 * @param {string} prop
 * @returns {boolean} error.result The result of the validation test
 * @returns {string} error.message The error message associated with test
 */
export const isUrl = prop => {
  const url = prop.includes('http') ? prop : `http://${prop}`
  let result = true
  try {
    new URL(url)
  } catch(err) {
    result = false
  }

  return {
    result,
    message: `${prop} is not a valid url`
  }
}

/**
 * Gets the type of the prop
 *
 * @param {string} prop
 * @returns {string} type The type of the prop
 */
export const getType = prop => {
  return Object.prototype.toString.call(prop)
}

/**
 * Validate node
 *
 * @param {object} obj 
 * @returns {boolean} hasErrors Whether or not the object props have errors
 */
export const validateNode = obj => {
  const errors = []

  // ensure the node has all the properties defined in nodeRules
  if(Object.keys(nodeRules).filter(prop => !Object.keys(obj).includes(prop)).length > 0) {
    logger.error(`Name, url, port, ssl, and cache are required for each node; check: ${JSON.stringify(obj, null, 2)}`)
    errors.push(true)
  } else {
    // loop through all entries in object
    for (const [ key, value ] of Object.entries(obj)) {
      // loop through all methods in rules and check if the value passes rule
      // if not then log an error message and return true
      errors.push(nodeRules[key].every(fn => {
        const { result, message } = fn(value)
        if(!result) {
          logger.error(`Check the value for ${key}: ${message} in ${JSON.stringify(obj, null, 2)}`)
          return 'true'
        }
      }))
    }
  }

  // remove duplicates and check if true (has errors) exists
  return ![...new Set(errors)].includes(true)
}

// rules that each value should pass
const nodeRules = {
  name: [
    isString,
    isValidLength
  ],
  url: [
    isString,
    isUrl
  ],
  port: [
    isNumber
  ],
  ssl: [
    isBoolean
  ],
  cache: [
    isBoolean
  ]
}
