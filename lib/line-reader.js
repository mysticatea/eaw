/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

const LINE_TERMINATOR = /\r\n|\r|\n|\u2028|\u2029/

/**
 * The stream which splits input by line terminators.
 *
 * @private
 */
module.exports = class LineReader {
    /**
     * It initializes a LineStream instance.
     */
    constructor() {
        this.lines = []
        this.buffer = ""
    }

    /**
     * It finds lines.
     *
     * @param {string} chunk - The text to push.
     * @returns {void}
     */
    push(chunk) {
        this.buffer += chunk.toString()

        let m = null
        while ((m = LINE_TERMINATOR.exec(this.buffer)) != null) {
            this.lines.push(this.buffer.slice(0, m.index))
            this.buffer = this.buffer.slice(m.index + m[0].length)
        }
    }

    /**
     * It returns lines, and clears the internal buffer.
     *
     * @param {boolean} flush - The flag to return the last line in the buffer.
     * @returns {string[]} The detected lines.
     */
    getLines(flush) {
        const lines = this.lines
        this.lines = []

        if (flush && this.buffer) {
            lines.push(this.buffer)
            this.buffer = ""
        }

        return lines
    }
}
