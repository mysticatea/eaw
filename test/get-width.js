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
const getWidth = require("../").getWidth

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("getWidth function", () => {
    const patterns = [
        ["Hello", 5, 5],
        ["アイウエオ", 10, 7.5],
        ["ｱｲｳｴｵ", 5, 5],
        ["Hello, 世界", 11, 10],
        ["ひとつ､ふたつ｡", 14, 11],
        ["👍", 2, 1.5],
    ]

    for (const x of patterns) {
        it(`should return ${x[1]} if "${x[0]}" was given.`, () => {
            assert(getWidth(x[0]) === x[1])
        })
    }

    it(`should return ${
        JSON.stringify(patterns.map(x => x[1]))
    } if ${
        JSON.stringify(patterns.map(x => x[0]))
    } was given.`, () => {
        assert.deepEqual(
            getWidth(patterns.map(x => x[0])),
            patterns.map(x => x[1])
        )
    })

    for (const x of patterns) {
        it(`should return ${x[2]} if "${x[0]}" was given (x1.5).`, () => {
            assert(getWidth(x[0], 1.5) === x[2])
        })
    }

    it(`should return ${
        JSON.stringify(patterns.map(x => x[2]))
    } if ${
        JSON.stringify(patterns.map(x => x[0]))
    } was given (x1.5).`, () => {
        assert.deepEqual(
            getWidth(patterns.map(x => x[0]), 1.5),
            patterns.map(x => x[2])
        )
    })
})
