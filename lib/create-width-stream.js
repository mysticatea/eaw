/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Transform = require("stream").Transform
const getWidth = require("./get-width")
const LineReader = require("./line-reader")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * The transform stream to calculate the width of each line.
 *
 * @private
 */
class GetWidthStream extends Transform {
    /**
     * It initializes a GetWidthStream instance.
     *
     * @param {number} [widthOfWide=2] - The width of wide characters.
     */
    constructor(widthOfWide) {
        super({
            decodeStrings: false,
            readableObjectMode: true,
        })

        this.widthOfWide = widthOfWide || 2
        this.reader = new LineReader()
    }

    /**
     * It calculates the width of lines.
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
        for (const line of this.reader.getLines(false)) {
            this.push(getWidth(line, this.widthOfWide))
        }
        callback()
    }

    /**
     * It calculates the width of lines.
     *
     * @param {function} callback - A callback function (optionally with an
     *  error argument and data) to be called after the supplied chunk has been
     *  processed.
     * @returns {void}
     */
    _flush(callback) {
        for (const line of this.reader.getLines(true)) {
            this.push(getWidth(line, this.widthOfWide))
        }
        callback()
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * It returns the transform stream to calculate the width of each line.
 *
 * @param {number} [widthOfWide=2] - The width of wide characters.
 * @returns {Transform} The transform stream to calculate the width of each line.
 */
module.exports = function createWidthStream(widthOfWide) {
    return new GetWidthStream(widthOfWide)
}
