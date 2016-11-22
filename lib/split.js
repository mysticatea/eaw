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
 * @param {number} maxPerLine - The maximum width of each line.
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {Iterable<string>} The splitted strings.
 * @private
 */
function* splitSingle(text, maxPerLine, widthOfWide) {
    const wide = widthOfWide || 2

    let line = ""
    let width = 0
    for (const c of String(text)) {
        const w = isNarrow(c) ? 1 : wide
        width = width + w

        if (width > maxPerLine) {
            if (line === "") {
                yield c
                line = ""
                width = 0
            }
            else {
                yield line
                line = c
                width = w
            }
        }
        else {
            line = line + c
        }
    }

    if (line !== "") {
        yield line
    }
}

/**
 * It calculates the total width of each text.
 *
 * @param {Iterable<string>} iterable - The text to calculate.
 * @param {number} maxPerLine - The maximum width of each line.
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {Iterable<string>} The splitted strings.
 * @private
 */
function* splitMulti(iterable, maxPerLine, widthOfWide) {
    for (const text of iterable) {
        yield* splitSingle(text, maxPerLine, widthOfWide)
    }
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
 * @param {string|string[]|Iterable<string>} text - The text to split.
 * @param {number} maxPerLine - The maximum width of each line.
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {string[]|Iterable<string>} The splitted strings.
 */
module.exports = function split(text, maxPerLine, widthOfWide) {
    if (Array.isArray(text)) {
        return Array.from(splitMulti(text, maxPerLine, widthOfWide))
    }
    if (typeof text !== "string" && Symbol.iterator in text) {
        return splitMulti(text, maxPerLine, widthOfWide)
    }
    return Array.from(splitSingle(text, maxPerLine, widthOfWide))
}
