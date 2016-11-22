/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const EOL = require("os").EOL
const Transform = require("stream").Transform
const split = require("./split")
const LineReader = require("./line-reader")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * The transform stream to split the given characters to make the width of each
 * line shorter than the given number.
 *
 * @private
 */
class SplitStream extends Transform {
    /**
     * It initializes a SplitStream instance.
     *
     * @param {number} maxPerLine - The maximum width of each line.
     * @param {number} [widthOfWide=2] - The width of wide characters.
     */
    constructor(maxPerLine, widthOfWide) {
        super({decodeStrings: false})

        this.maxPerLine = maxPerLine
        this.widthOfWide = widthOfWide || 2
        this.reader = new LineReader()
        this.setEncoding("utf8")
    }

    /**
     * It splits the given characters to make the width of each line shorter
     * than the given number.
     *
     * @param {Buffer|string} chunk - The chunk to be transformed.
     * @param {string} _encoding - If the chunk is a string, then this is the
     *  encoding type. If chunk is a buffer, then this is the special value -
     *  'buffer', ignore it in this case.
     * @param {function} callback - A callback function (optionally with an
     *  error argument and data) to be called after the supplied chunk has been
     *  processed.
     * @returns {void}
     */
    _transform(chunk, _encoding, callback) {
        this.reader.push(chunk.toString())
        this._emitLines(false)
        callback()
    }

    /**
     * It splits the given characters to make the width of each line shorter
     * than the given number.
     *
     * @param {function} callback - A callback function (optionally with an
     *  error argument and data) to be called after the supplied chunk has been
     *  processed.
     * @returns {void}
     */
    _flush(callback) {
        this._emitLines(true)
        callback()
    }

    /**
     * It emits splitted lines.
     *
     * @param {boolean} flush - The flag to emit the last line.
     * @returns {void}
     */
    _emitLines(flush) {
        for (const line of this.reader.getLines(flush)) {
            for (const sl of split(line, this.maxPerLine, this.widthOfWide)) {
                this.push(`${sl}${EOL}`)
            }
        }
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * It returns the transform stream to split the given characters to make the
 * width of each line shorter than the given number.
 *
 * @param {number} maxPerLine - The maximum width of each line.
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {Transform} The transform stream to split the given characters to
 *  make the width of each line shorter than the given number.
 */
module.exports = function createSplitStream(maxPerLine, widthOfWide) {
    return new SplitStream(maxPerLine, widthOfWide)
}
