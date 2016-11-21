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
const isNarrowCharacter = require("../").isNarrowCharacter

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("isNarrowCharacter function", () => {
    for (const character of "0A/*(?ｱ｡･") {
        it(`should return \`true\` if "${character}" was given.`, () => {
            assert(isNarrowCharacter(character) === true)
        })
    }

    for (const character of "あア阿？。・／👍🚀") {
        it(`should return \`false\` if "${character}" was given.`, () => {
            assert(isNarrowCharacter(character) === false)
        })
    }
})
