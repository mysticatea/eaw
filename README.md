# eaw

The Node.js module to calculate the width of east Asian characters.

The script of this module is generated with [EastAsianWidth.txt] Unicode Character Database provides.
The generator script is [./scripts/generate.js].

## 💿 Installation

This module can be installed by [npm].

    $ npm install --save eaw

- It requires Node.js `>=4.0.0`.
- It can be used in browsers by [browserify]-like tools.

## 📖 Usage

### CLI

This module provides a CLI command: `eaw`

The command calculates the width of east Asian characters for each line.

```
Usage: eaw [OPTIONS]

    It calculates the width of given east Asian characters.
    It reads the characters from stdin or `--text` option.

    OPTIONS:
        -s, --split <NUMBER> ... It splits the given text by LF to make the
                                 width of each line shorter than the given
                                 number.
        -t, --text <TEXT> ...... The characters that eaw processes instead of
                                 stdin.

Example:
    $ eaw --text "hello, 世界"
    11
    $ cat hello.txt | eaw
    11
    $ cat hello.txt | eaw --split 4
    hell
    o,
    世界
```

### Node.js

This module provides Node.js module.

```js
const eaw = require("eaw")

console.log(eaw.getWidth("hello, 世界")) // → 11
console.log(eaw.getWidth(["hello, 世界", "🌟❤"])) // → [11, 4]
console.log(eaw.split("hello, 世界", 4)) // → ["hell", "o, ", "世界"]
console.log(eaw.split(["hello, 世界", "🌟❤👍"], 4)) // → ["hell", "o, ", "世界", "🌟❤", "👍"]

process.stdin
    .pipe(eaw.createWidthStream())
    .pipe(process.stdout)

process.stdin
    .pipe(eaw.createSplitStream(4))
    .pipe(process.stdout)
```

#### eaw.getWidth(characters: string): number

It returns the total width of the given characters.

#### eaw.getWidth(characters: string[]): number[]

It returns the total width of each given characters.

#### eaw.split(characters: string, maxPerLine: number): string[]

It splits the given characters to make the width of each line shorter than the given number.

#### eaw.split(characters: string[], maxPerLine: number): string[]

It splits the given characters to make the width of each line shorter than the given number.

#### eaw.createWidthStream(): [stream.Transform]

It returns the transform stream to calculate the width of each line.

#### eaw.createSplitStream(maxPerLine: number): [stream.Transform]

It returns the transform stream to split the given characters to make the width of each line shorter than the given number.

## 📰 Changelog

See [GitHub Releases]

## 💪 Contributing

Welcom your contributing!

Please use GitHub's issues/PRs.

### Development tools

- `npm test` runs tests.
- `npm run build` generates the script from [EastAsianWidth.txt].
- `npm run clean` removes the coverage result of the last `npm test` command.
- `npm run coverage` opens the coverage of the last `npm test` command by browsers.
- `npm run lint` runs [ESLint].
- `npm run watch` runs tests for each file change.

[EastAsianWidth.txt]: http://www.unicode.org/Public/UCD/latest/ucd/EastAsianWidth.txt
[./scripts/generate.js]: ./scripts/generate.js
[npm]: https://www.npmjs.com/
[browserify]: http://browserify.org/
[stream.Transform]: https://nodejs.org/api/stream.html#stream_class_stream_transform
[GitHub Releases]: https://github.com/mysticatea/eaw/releases
[ESLint]: http://eslint.org/