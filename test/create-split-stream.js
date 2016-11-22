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
const createSplitStream = require("../").createSplitStream

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

    for (let i = 0; i < patterns[0][1].length; ++i) {
        it(`should return ${
            JSON.stringify([].concat.apply([], patterns.map(x => x[1][i])))
        } if "${
            patterns.map(x => x[0]).join("\\n")
        }" was given with max ${3 + i} and ww 2.`, (next) => {
            const stream = createSplitStream(3 + i)
            const expected = [].concat.apply([], patterns.map(x => x[1][i]))

            let j = 0
            stream.on("data", (line) => {
                assert(line === expected[j++])
            })
            stream.on("end", () => {
                assert(j === expected.length)
                next()
            })

            const text = patterns.map(x => x[0]).join("\n")
            const middle = text.length / 2 | 0

            stream.write(text.slice(0, middle))
            stream.write(text.slice(middle))
            stream.end()
        })
    }

    for (let i = 0; i < patterns[0][2].length; ++i) {
        it(`should return ${
            JSON.stringify([].concat.apply([], patterns.map(x => x[2][i])))
        } if "${
            patterns.map(x => x[0]).join("\\n")
        }" was given with max ${3 + i} and ww 1.5.`, (next) => {
            const stream = createSplitStream(3 + i, 1.5)
            const expected = [].concat.apply([], patterns.map(x => x[2][i]))

            let j = 0
            stream.on("data", (line) => {
                assert(line === expected[j++])
            })
            stream.on("end", () => {
                assert(j === expected.length)
                next()
            })

            const text = patterns.map(x => x[0]).join("\n")
            const middle = text.length / 2 | 0

            stream.write(text.slice(0, middle))
            stream.write(text.slice(middle))
            stream.end()
        })
    }
})
