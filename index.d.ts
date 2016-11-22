/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

import {Transform} from "stream"

export {getWidth, isNarrowCharacter, split} from "./browser"
export function createSplitStream(maxPerLine: number, widthOfWideCharacter?: number): Transform
export function createWidthStream(widthOfWideCharacter?: number): Transform
