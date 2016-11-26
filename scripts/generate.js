/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

/*eslint-disable no-console */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Buffer = require("buffer").Buffer
const fs = require("fs")
const http = require("http")
const path = require("path")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const UCD_URL = "http://www.unicode.org/Public/UCD/latest/ucd/EastAsianWidth.txt"
const FILENAME = path.resolve(__dirname, "../lib/is-narrow-character.js")
const ROW_PATTERN = /^(\w+)(?:..(\w+))?;(\w+)\s*(?:#.*)?$/gm

/**
 * It checks whether the given type is narrow or not.
 *
 * @param {string} type - The type of characters.
 * @returns {boolean} `true` if the type is narrow.
 */
function isNarrow(type) {
    return type === "H" || type === "Na"
}

/**
 * It converts the number to upper case hex string.
 *
 * @param {number} n - The number to convert.
 * @returns {string} The hex string of the number.
 */
function toHex(n) {
    return `0x${n.toString(16).toUpperCase()}`
}

/**
 * It fetches characters information from Unicode Character Database.
 *
 * @returns {Promise<string>} The content of database.
 */
function fetchUnicodeCharacterData() {
    return new Promise((resolve, reject) => {
        console.log("Fetching:", UCD_URL)

        http.get(UCD_URL, (res) => {
            const chunks = []

            res.on("data", (chunk) => {
                console.log("  Received", chunk.length, "bytes.")
                chunks.push(chunk)
            })
            res.on("end", () => {
                console.log("  Done.")
                const text = Buffer.concat(chunks).toString("utf8")

                if (res.statusCode === 200) {
                    resolve(text)
                }
                else {
                    reject(new Error(text || "Unknown Error"))
                }
            })
            res.on("error", reject)
        }).on("error", reject)
    })
}

/**
 * It parses the content of Unicode Character Database.
 *
 * @param {string} content - The content to parse.
 * @returns {IterableIterator<{first: number, last: number, type: string}>}
 *  The result of parsing.
 */
function* parseUnicodeCharacterData(content) {
    ROW_PATTERN.lastIndex = 0
    let m = null

    while ((m = ROW_PATTERN.exec(content)) != null) {
        const first = parseInt(m[1], 16)
        const last = m[2] ? parseInt(m[2], 16) : first
        const type = m[3]

        yield {first, last, type}
    }
}

/**
 * It extracts the range of narrow characters.
 *
 * @param {Iterable<{first: number, last: number, type: string}>} ranges -
 *  The range of all characters.
 * @returns {IterableIterator<{first: number, last: number}>}
 *  The range of narrow characters.
 */
function* extractNarrowRange(ranges) {
    let prevRange = null

    for (const range of ranges) {
        if (!isNarrow(range.type)) {
            continue
        }

        const first = range.first
        const last = range.last

        if (prevRange == null) {
            // 1st range.
            prevRange = {first, last}
        }
        else if (prevRange.last === first - 1) {
            // if the range is consecutive with the last range,
            // it merges those.
            prevRange.last = last
        }
        else {
            console.log("Range:", prevRange.first, prevRange.last)
            yield prevRange

            prevRange = {first, last}
        }
    }

    if (prevRange != null) {
        console.log("Range:", prevRange.first, prevRange.last)
        yield prevRange
    }
}

/**
 * It converts the given ranges to comparison code list.
 *
 * The comparison code list can be concatenated by `||` operators.
 *
 * @param {Iterable<{first: number, last: number}>} ranges -
 *  The ranges to convert.
 * @returns {IterableIterator<string>} The generated code.
 */
function* toComparisonCode(ranges) {
    for (const range of ranges) {
        const first = range.first
        const last = range.last

        if (first === last) {
            yield `cp === ${toHex(first)}`
        }
        else if (first + 1 === last) {
            yield `cp === ${toHex(first)}`
            yield `cp === ${toHex(last)}`
        }
        else {
            yield `(cp >= ${toHex(first)} && cp <= ${toHex(last)})`
        }
    }
}

/**
 * It generates the code which includes `isNarrowCharacter` function.
 *
 * @param {Iterable<string>} comparisonCodes - The comparison codes.
 * @returns {string} The generated code.
 */
function generateCode(comparisonCodes) {
    return `/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------
/*eslint-disable complexity */

/**
 * It checks whether the given character is a narrow character or not.
 *
 * @param {string} character - The character to check.
 * @returns {boolean} \`true\` if the character is a narrow character.
 */
module.exports = function isNarrowCharacter(character) {
    const cp = character.codePointAt(0)
    return (
        ${Array.from(comparisonCodes).join(" ||\n        ")}
    )
}

/*eslint-enable */
`
}

/**
 * It writes the code to `lib/is-narrow-character.js` file.
 *
 * @param {string} code - The code to write.
 * @returns {Promise<void>} -
 */
function writeFile(code) {
    return new Promise((resolve, reject) => {
        console.log("Writing:", FILENAME)

        fs.writeFile(FILENAME, code, (err) => {
            if (err == null) {
                console.log("  Done.")
                resolve()
            }
            else {
                reject(err)
            }
        })
    })
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

fetchUnicodeCharacterData()
    .then(parseUnicodeCharacterData)
    .then(extractNarrowRange)
    .then(toComparisonCode)
    .then(generateCode)
    .then(writeFile)
    .catch(err => {
        console.error(err.stack)
    })

/*eslint-enable */
