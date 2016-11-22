/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert")
const split = require("../").split

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * It converts the given array to an iterable object.
 *
 * @param {any[]} array - The array to convert.
 * @returns {IterableIterator<any>} The iterable object of the array.
 */
function* toIterable(array) {
    yield* array
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("split function", () => {
    const patterns = [
        [
            "Hello",
            [["Hel", "lo"], ["Hell", "o"], ["Hello"]], // x2.0; by 3, 4, 5
            [["Hel", "lo"], ["Hell", "o"], ["Hello"]], // x1.5; by 3, 4, 5
        ],
        [
            "アイウエオ",
            [["ア", "イ", "ウ", "エ", "オ"], ["アイ", "ウエ", "オ"], ["アイ", "ウエ", "オ"]],
            [["アイ", "ウエ", "オ"], ["アイ", "ウエ", "オ"], ["アイウ", "エオ"]],
        ],
        [
            "ｱｲｳｴｵ",
            [["ｱｲｳ", "ｴｵ"], ["ｱｲｳｴ", "ｵ"], ["ｱｲｳｴｵ"]],
            [["ｱｲｳ", "ｴｵ"], ["ｱｲｳｴ", "ｵ"], ["ｱｲｳｴｵ"]],
        ],
        [
            "Hello, 世界",
            [["Hel", "lo,", " 世", "界"], ["Hell", "o, ", "世界"], ["Hello", ", 世", "界"]],
            [["Hel", "lo,", " 世", "界"], ["Hell", "o, ", "世界"], ["Hello", ", 世界"]],
        ],
        [
            "ひとつ､ふたつ｡",
            [["ひ", "と", "つ､", "ふ", "た", "つ｡"], ["ひと", "つ､", "ふた", "つ｡"], ["ひと", "つ､ふ", "たつ｡"]],
            [["ひと", "つ､", "ふた", "つ｡"], ["ひと", "つ､ふ", "たつ｡"], ["ひとつ", "､ふた", "つ｡"]],
        ],
    ]

    for (const x of patterns) {
        for (let i = 0; i < x[1].length; ++i) {
            it(`should return ${JSON.stringify(x[1][i])} if ("${x[0]}", ${3 + i}) was given.`, () => {
                assert.deepEqual(split(x[0], 3 + i), x[1][i])
            })
        }
    }

    for (let i = 0; i < patterns[0][1].length; ++i) {
        it(`should return ${
            JSON.stringify([].concat.apply([], patterns.map(x => x[1][i])))
        } if ("${
            JSON.stringify(patterns.map(x => x[0]))
        }", ${3 + i}) was given.`, () => {
            assert.deepEqual(
                split(
                    patterns.map(x => x[0]),
                    3 + i
                ),
                [].concat.apply([], patterns.map(x => x[1][i]))
            )
        })
    }

    for (const x of patterns) {
        for (let i = 0; i < x[2].length; ++i) {
            it(`should return ${JSON.stringify(x[2][i])} if ("${x[0]}", ${3 + i}, 1.5) was given.`, () => {
                assert.deepEqual(split(x[0], 3 + i, 1.5), x[2][i])
            })
        }
    }

    for (let i = 0; i < patterns[0][2].length; ++i) {
        it(`should return ${
            JSON.stringify([].concat.apply([], patterns.map(x => x[2][i])))
        } if ("${
            JSON.stringify(patterns.map(x => x[0]))
        }", ${3 + i}, 1.5) was given.`, () => {
            assert.deepEqual(
                split(
                    patterns.map(x => x[0]),
                    3 + i,
                    1.5
                ),
                [].concat.apply([], patterns.map(x => x[2][i]))
            )
        })
    }

    for (let i = 0; i < patterns[0][1].length; ++i) {
        it(`should return the iterable object of ${
            JSON.stringify([].concat.apply([], patterns.map(x => x[1][i])))
        } if the iterable object of ${
            JSON.stringify(patterns.map(x => x[0]))
        } with ${3 + i} was given.`, () => {
            const expected = [].concat.apply([], patterns.map(x => x[1][i]))
            const result = split(toIterable(patterns.map(x => x[0])), 3 + i)

            assert(!Array.isArray(result))

            let j = 0
            for (const line of result) {
                assert(line === expected[j++])
            }
            assert(j === expected.length)
        })
    }
})
