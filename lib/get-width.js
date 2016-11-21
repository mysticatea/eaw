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
function getWidthCore(text, widthOfWide) {
    const wide = widthOfWide || 2
    let width = 0
    for (const c of String(text)) {
        width = width + (isNarrow(c) ? 1 : wide)
    }
    return width
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * It calculates the total width of the given text.
 *
 * Surrogate pairs are always wide characters.
 *
 * @param {string|string[]} textOrArray - The text to calculate.
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {number|number[]} The total width of the text.
 */
module.exports = function getWidth(textOrArray, widthOfWide) {
    if (Array.isArray(textOrArray)) {
        return textOrArray.map(text => getWidthCore(text, widthOfWide))
    }
    return getWidthCore(textOrArray, widthOfWide)
}
