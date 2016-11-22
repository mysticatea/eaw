/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const createSplitStream = require("../lib/create-split-stream")

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------
/*eslint-disable no-console */

module.exports = function split(text, maxPerLine) {
    if (Number.isNaN(maxPerLine)) {
        console.error("Invalid `--split` value")
        process.exitCode = 1
        return
    }

    if (text) {
        const stream = createSplitStream(maxPerLine)
        stream.pipe(process.stdout)
        stream.write(text)
        stream.end()
    }
    else {
        process.stdin
            .pipe(createSplitStream(maxPerLine))
            .pipe(process.stdout)
    }
}

/*eslint-enable */
