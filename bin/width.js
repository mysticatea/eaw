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
const createWidthStream = require("../lib/create-width-stream")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * The stream which appends a line terminator for each chunk.
 */
class LineTerminatorStream extends Transform {
    /**
     * It initializes a LineTerminatorStream stream.
     */
    constructor() {
        super({writableObjectMode: true})
    }

    /**
     * It emits the chunk as is, then append a line terminator.
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
        this.push(`${chunk.toString()}${EOL}`)
        callback()
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = function split(text) {
    if (text) {
        const stream = createWidthStream()
        stream
            .pipe(new LineTerminatorStream())
            .pipe(process.stdout)
        stream.write(text)
        stream.end()
    }
    else {
        process.stdin
            .pipe(createWidthStream())
            .pipe(new LineTerminatorStream())
            .pipe(process.stdout)
    }
}
