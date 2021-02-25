// type AllianceColor = 'WHITE' | 'BLACK';

import { BOARD_SIZE } from '../Utils'
type Sign = -1 | 1
type AllianceColor = 'WHITE' | 'BLACK'
export class Direction {
  readonly backward: number
  readonly left: Sign
  readonly right: Sign
  constructor(readonly forward: number) {
    const sign = Math.sign(forward) as Sign
    this.left = sign
    this.right = -sign as Sign
    this.backward = -forward
  }
  valueOf() {
    return this.forward
  }
}

export default class Alliance {
  static BLACK = new Alliance('BLACK', new Direction(BOARD_SIZE));
  static WHITE = new Alliance('WHITE', new Direction(-BOARD_SIZE));
  static GET_ALLIANCE = { 'w': Alliance.WHITE, 'b': Alliance.BLACK }
  opponent!: Alliance
  readonly symbol: 'w' | 'b'
  constructor(readonly color: AllianceColor, readonly direction: Direction) {
    this.symbol = color[0].toLowerCase() as 'w'
  }

  setOpponent(opponent: Alliance) {
    this.opponent = opponent
  }
}