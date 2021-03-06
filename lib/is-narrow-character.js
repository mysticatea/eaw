/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------
/*eslint-disable complexity */

/**
 * It checks whether the given character is a narrow character or not.
 *
 * @param {string} character - The character to check.
 * @returns {boolean} `true` if the character is a narrow character.
 */
module.exports = function isNarrowCharacter(character) {
    const cp = character.codePointAt(0)
    return (
        (cp >= 0x20 && cp <= 0x7E) ||
        cp === 0xA2 ||
        cp === 0xA3 ||
        cp === 0xA5 ||
        cp === 0xA6 ||
        cp === 0xAC ||
        cp === 0xAF ||
        cp === 0x20A9 ||
        (cp >= 0x27E6 && cp <= 0x27ED) ||
        cp === 0x2985 ||
        cp === 0x2986 ||
        (cp >= 0xFF61 && cp <= 0xFFBE) ||
        (cp >= 0xFFC2 && cp <= 0xFFC7) ||
        (cp >= 0xFFCA && cp <= 0xFFCF) ||
        (cp >= 0xFFD2 && cp <= 0xFFD7) ||
        (cp >= 0xFFDA && cp <= 0xFFDC) ||
        (cp >= 0xFFE8 && cp <= 0xFFEE)
    )
}

/*eslint-enable */
