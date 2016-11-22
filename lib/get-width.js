/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const isNarrow = require("./is-narrow-character")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * It calculates the total width of the given text.
 *
 * @param {string} text - The text to calculate.
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {number} The total width of the text.
 * @private
 */
function getWidthSingle(text, widthOfWide) {
    const wide = widthOfWide || 2
    let width = 0
    for (const c of String(text)) {
        width += isNarrow(c) ? 1 : wide
    }
    return width
}

/**
 * It calculates the total width of each text.
 *
 * @param {Iterable<string>} iterable - The iterable object of text to calculate.
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {Iterable<number>} The total width of the text.
 * @private
 */
function* getWidthMulti(iterable, widthOfWide) {
    for (const text of iterable) {
        yield getWidthSingle(text, widthOfWide)
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * It calculates the total width of the given text.
 *
 * Surrogate pairs are always wide characters.
 *
 * @param {string|string[]|Iterable<string>} text - The text to calculate.
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {number|number[]|Iterable<number>} The total width of the text.
 */
module.exports = function getWidth(text, widthOfWide) {
    if (Array.isArray(text)) {
        return Array.from(getWidthMulti(text, widthOfWide))
    }
    if (typeof text !== "string" && Symbol.iterator in text) {
        return getWidthMulti(text, widthOfWide)
    }
    return getWidthSingle(text, widthOfWide)
}
