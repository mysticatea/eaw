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
const createWidthStream = require("../").createWidthStream

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("createWidthStream function", () => {
    const patterns = [
        ["Hello", 5, 5],
        ["アイウエオ", 10, 7.5],
        ["ｱｲｳｴｵ", 5, 5],
        ["Hello, 世界", 11, 10],
        ["ひとつ､ふたつ｡", 14, 11],
        ["👍", 2, 1.5],
    ]

    it(`should output ${
        JSON.stringify(patterns.map(x => x[1]))
    } if "${
        patterns.map(x => x[0]).join("\\n")
    }" was given.`, (next) => {
        const stream = createWidthStream()

        let i = 0
        stream.on("data", (width) => {
            assert(width === patterns[i++][1])
        })
        stream.on("end", () => {
            assert(i === patterns.length)
            next()
        })

        const text = patterns.map(x => x[0]).join("\n")
        const middle = text.length / 2 | 0

        stream.write(text.slice(0, middle))
        stream.write(text.slice(middle))
        stream.end()
    })

    it(`should output ${
        JSON.stringify(patterns.map(x => x[1]))
    } if "${
        patterns.map(x => x[0]).join("\\n")
    }" was given (with x1.5).`, (next) => {
        const stream = createWidthStream(1.5)

        let i = 0
        stream.on("data", (width) => {
            assert(width === patterns[i++][2])
        })
        stream.on("end", () => {
            assert(i === patterns.length)
            next()
        })

        const text = patterns.map(x => x[0]).join("\n")
        const middle = text.length / 2 | 0

        stream.write(text.slice(0, middle))
        stream.write(text.slice(middle))
        stream.end()
    })
})
