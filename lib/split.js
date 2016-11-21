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
 * @param {string[]} result - The splitted strings.
 * @param {string} text - The text to calculate.
 * @param {number} maxPerLine - The maximum width of each line.
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {string[]} The splitted strings.
 * @private
 */
function splitCore(result, text, maxPerLine, widthOfWide) {
    const wide = widthOfWide || 2

    let line = ""
    let width = 0
    for (const c of String(text)) {
        const w = isNarrow(c) ? 1 : wide
        width = width + w

        if (width > maxPerLine) {
            if (line === "") {
                result.push(c)
                line = ""
                width = 0
            }
            else {
                result.push(line)
                line = c
                width = w
            }
        }
        else {
            line = line + c
        }
    }

    if (line !== "") {
        result.push(line)
    }

    return result
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * It splits the given characters to make the width of each line shorter than
 * the given number.
 *
 * Surrogate pairs are always wide characters.
 *
 * @param {string|string[]} textOrArray - The text to split.
 * @param {number} maxPerLine - The maximum width of each line.
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {string[]} The splitted strings.
 */
module.exports = function split(textOrArray, maxPerLine, widthOfWide) {
    if (Array.isArray(textOrArray)) {
        return textOrArray.reduce(
            (result, text) => splitCore(result, text, maxPerLine, widthOfWide),
            []
        )
    }
    return splitCore([], textOrArray, maxPerLine, widthOfWide)
}
