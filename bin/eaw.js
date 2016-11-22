#!/usr/bin/env node
/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const minimist = require("minimist")

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------
/*eslint-disable no-console */

const unknowns = []
const argv = minimist(
    process.argv.slice(2),
    {
        alias: {
            h: "help",
            s: "split",
            t: "text",
            v: "version",
        },
        boolean: ["help", "version"],
        string: ["split", "text"],
        unknown: (arg) => {
            unknowns.push(arg)
        },
    }
)

if (unknowns.length > 0) {
    console.error("Unknown options:", unknowns.join(", "))
    console.error(require("./help"))
    process.exitCode = 1
}
else if (argv.help) {
    console.log(require("./help"))
}
else if (argv.version) {
    console.log(require("./version"))
}
else if (argv.split) {
    require("./split")(argv.text, Number(argv.split))
}
else {
    require("./width")(argv.text)
}

/*eslint-enable */
