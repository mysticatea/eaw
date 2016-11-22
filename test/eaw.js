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
const Buffer = require("buffer").Buffer
const cp = require("child_process")
const EOL = require("os").EOL
const path = require("path")
const Writable = require("stream").Writable

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const BIN_FILE = path.resolve(__dirname, "../bin/eaw.js")

/**
 * The writable stream to get input as a string.
 *
 * @private
 */
class BufferStream extends Writable {
    /**
     * It initializes a BufferStream instance.
     */
    constructor() {
        super()
        this.chunks = []
    }

    /**
     * The input value.
     * @type {string}
     */
    get value() {
        return Buffer.concat(this.chunks).toString()
    }

    /**
     * @param {Buffer} chunk - The chunk to be written.
     * @param {string} encoding - Useless.
     * @param {function} callback - Call this function (optionally with an error
     *  argument) when processing is complete for the supplied chunk.
     * @returns {void}
     */
    _write(chunk, encoding, callback) {
        this.chunks.push(chunk)
        callback()
    }
}

/**
 * It runs the `eaw` command, then returns the result.
 *
 * @param {string[]} args - Arguments to give to the command.
 * @param {string} [input] - The string to give to the command as stdin.
 * @returns {{exitCode: number, stdout: string, stderr: string}} The result.
 */
function run(args, input) {
    return new Promise((resolve, reject) => {
        const task = cp.spawn(
            process.execPath,
            [BIN_FILE].concat(args),
            {stdio: "pipe"}
        )
        const stdout = new BufferStream()
        const stderr = new BufferStream()

        task.stdout.pipe(stdout)
        task.stderr.pipe(stderr)
        task.stdin.end(input || "")
        task.on("error", reject)
        task.on("close", (exitCode) => {
            resolve({
                exitCode,
                stdout: stdout.value,
                stderr: stderr.value,
            })
        })
    })
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("eaw command", () => {
    it("should show the help text if --help option was given.", () =>
        run(["--help"]).then(result => {
            assert(result.exitCode === 0)
            assert(/Usage: eaw/.test(result.stdout))
            assert(result.stderr === "")
        })
    )
    it("should show the help text if -h option was given.", () =>
        run(["-h"]).then(result => {
            assert(result.exitCode === 0)
            assert(/Usage: eaw/.test(result.stdout))
            assert(result.stderr === "")
        })
    )
    it("should show the version text if --version option was given.", () =>
        run(["--version"]).then(result => {
            assert(result.exitCode === 0)
            assert(/v\d+.\d+.\d+/.test(result.stdout))
            assert(result.stderr === "")
        })
    )
    it("should show the version text if -v option was given.", () =>
        run(["-v"]).then(result => {
            assert(result.exitCode === 0)
            assert(/v\d+.\d+.\d+/.test(result.stdout))
            assert(result.stderr === "")
        })
    )

    it("should show \"5\\n\" if `--text hello` was given.", () =>
        run(["--text", "hello"]).then(result => {
            assert(result.exitCode === 0)
            assert(result.stdout === `5${EOL}`)
            assert(result.stderr === "")
        })
    )

    it("should show \"5\\n10\\n\" if `--text \"hello\\nこんにちは\"` was given.", () =>
        run(["--text", "hello\nこんにちは"]).then(result => {
            assert(result.exitCode === 0)
            assert(result.stdout === `5${EOL}10${EOL}`)
            assert(result.stderr === "")
        })
    )

    it("should show \"5\\n\" if \"hello\" was given as stdin.", () =>
        run([], "hello").then(result => {
            assert(result.exitCode === 0)
            assert(result.stdout === `5${EOL}`)
            assert(result.stderr === "")
        })
    )

    it("should show \"5\\n10\\n\" if \"hello\\nこんにちは\" was given as stdin.", () =>
        run([], "hello\nこんにちは").then(result => {
            assert(result.exitCode === 0)
            assert(result.stdout === `5${EOL}10${EOL}`)
            assert(result.stderr === "")
        })
    )

    it("should show \"hell\\no\\n\" if `--text hello --split 4` was given.", () =>
        run(["--text", "hello", "--split", "4"]).then(result => {
            assert(result.exitCode === 0)
            assert(result.stdout === `hell${EOL}o${EOL}`)
            assert(result.stderr === "")
        })
    )

    it("should show \"こん\\nにち\\nは\\n\" if `--text こんにちは --split 4` was given.", () =>
        run(["--text", "こんにちは", "--split", "4"]).then(result => {
            assert(result.exitCode === 0)
            assert(result.stdout === `こん${EOL}にち${EOL}は${EOL}`)
            assert(result.stderr === "")
        })
    )

    it("should show \"hell\\no\\n\" if `--split 4` and \"hello\" as stdin were given.", () =>
        run(["--split", "4"], "hello").then(result => {
            assert(result.exitCode === 0)
            assert(result.stdout === `hell${EOL}o${EOL}`)
            assert(result.stderr === "")
        })
    )

    it("should show \"こん\\nにち\\nは\\n\" if `--split 4` and \"こんにちは\" as stdin were given.", () =>
        run(["--split", "4"], "こんにちは").then(result => {
            assert(result.exitCode === 0)
            assert(result.stdout === `こん${EOL}にち${EOL}は${EOL}`)
            assert(result.stderr === "")
        })
    )

    it("should exit with 1 if unknown options were given.", () =>
        run(["abc"]).then(result => {
            assert(result.exitCode === 1)
            assert(result.stdout === "")
            assert(/Usage: eaw/.test(result.stderr))
        })
    )

    it("should exit with 1 if unknown options were given.", () =>
        run(["--abc"]).then(result => {
            assert(result.exitCode === 1)
            assert(result.stdout === "")
            assert(/Usage: eaw/.test(result.stderr))
        })
    )

    it("should exit with 1 if invalid --split option were given.", () =>
        run(["--split", "abc"]).then(result => {
            assert(result.exitCode === 1)
            assert(result.stdout === "")
            assert(/Invalid `--split`/.test(result.stderr))
        })
    )
})
