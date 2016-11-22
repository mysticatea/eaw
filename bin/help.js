/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = `
Usage: eaw [OPTIONS]

    It calculates the width of given east Asian characters.
    It reads the characters from stdin or \`--text\` option.

    OPTIONS:
        -h, --help ............. It shows this help text.
        -s, --split <NUMBER> ... It splits the given text by LF to make the
                                 width of each line shorter than the given
                                 number.
        -t, --text <TEXT> ...... The characters that eaw processes instead of
                                 stdin.
        -v, --version .......... It shows the version number.

Example:
    $ eaw --text "hello, 世界"
    11
    $ cat hello.txt | eaw
    11
    $ cat hello.txt | eaw --split 4
    hell
    o,
    世界

`
