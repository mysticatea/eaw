/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements and exports
//------------------------------------------------------------------------------

module.exports = {
    createSplitStream: require("./lib/create-split-stream"),
    createWidthStream: require("./lib/create-width-stream"),
    getWidth: require("./lib/get-width"),
    isNarrowCharacter: require("./lib/is-narrow-character"),
    split: require("./lib/split"),
}
