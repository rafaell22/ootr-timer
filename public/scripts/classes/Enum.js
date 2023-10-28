//@ts-check
'use strict'

export default class Enum {
  /** @type {string[]} */
  #enumValues = [];
  /**
   * @param {string[]} values - values of the enum. All values will be converted to uppercase.
   */
  constructor(...values) {
    for(const value of values) {
      const snakeCaseValue = value
      	// replace spaces ( ) with underscores (_)
      	.replace(/ /g, '_')
        // Add underscores before uppercase letters (to separate words)
        .replace(/(?<=[a-z])[A-Z]/g, (match) => { return `_${match}` })
        // replace lower case letters with their uppercase versions
        .replace(/[a-z]/g, (match) => { return match.toUpperCase() })
        // remove any repeated underscores
        .replace('__', '_')
        // remove underscore from start of string if any
        .replace(/^_/, '');

      this.#enumValues.push(snakeCaseValue);
      Object.defineProperty(this, snakeCaseValue, {
        enumerable: true,
        get: (function(/** @type {string} */enumValue) { return enumValue }).bind(this, snakeCaseValue),
        set() { throw new Error('Can\'t set property of Enum') }, // TODO - change to logging + default value
      })
    }

    Object.freeze(this);
  }

  /**
   * @returns {Array<string>}
   */
  values() {
    return this.#enumValues;
  }
}
