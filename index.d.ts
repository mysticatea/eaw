/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

import {Transform} from "stream"

export function createSplitStream(maxPerLine: number, widthOfWideCharacter?: number): Transform
export function createWidthStream(widthOfWideCharacter?: number): Transform
export function getWidth(text: string, widthOfWideCharacter?: number): number
export function getWidth(texts: string[], widthOfWideCharacter?: number): number[]
export function getWidth(texts: Iterable<string>, widthOfWideCharacter?: number): IterableIterator<number>
export function isNarrowCharacter(character: string): boolean
export function split(text: string, maxPerLine: number, widthOfWideCharacter?: number): string[]
export function split(texts: string[], maxPerLine: number, widthOfWideCharacter?: number): string[]
export function split(texts: Iterable<string>, maxPerLine: number, widthOfWideCharacter?: number): IterableIterator<string>
