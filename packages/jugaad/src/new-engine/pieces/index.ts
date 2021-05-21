import { Board } from '../board'
import { Alliance } from '../player'
import { PieceSymbol, SYMBOL } from '../Utils'

export class PieceType {
  constructor(readonly symbol: PieceSymbol, readonly value: number, readonly maxParity: number) {
  }
}
export abstract class Piece {
  static NULL_PIECE = null;
  isNull = false
  static Create(notation: string, position: number): Piece {
    const symbol = notation.toUpperCase(), mesh: Record<string, typeof Piece> = {
      I: Rajendra
    }
    const PieceClass = mesh[symbol]
    if (!PieceClass) throw new Error("Invalid Notation Used!")
    const alliance = notation == symbol ? Alliance.WHITE : Alliance.BLACK
    // @ts-ignore
    return new PieceClass(position, alliance)
  }

  type: PieceType
  constructor(readonly position: number, readonly alliance: Alliance) {
    this.type = (this.constructor as any).Type
    if (!this.type) throw new Error("Piece type not specified")

  }
  isFriendly(piece: Piece) {
    return this.alliance === piece.alliance
  }
  isEnemy(piece: Piece) {
    return !(piece.isNull || this.isFriendly(piece))
  }

  doesBelongsToActivePlayer(board: Board) {
    return board.activeAlliance == this.alliance
  }

  get isRoyal(): boolean {
    return this instanceof RoyalPiece
  }
  get isOfficer(): boolean {
    return this instanceof OfficerPiece
  }
  get isGodman(): boolean {
    return this instanceof OfficerPiece
  }
  get isSoldier(): boolean {
    return this instanceof OfficerPiece
  }
}
const returnFalse: () => false = () => false
export class NullPiece extends Piece {
  isNull = true
  constructor() {
    super(-1, null)
  }
  calculateLegalMoves(): never {
    throw new Error("Can't calculate moves on empty square!")
  }
  moveTo(): never {
    throw new Error('No piece to move')
  }
  isFriendly() { return returnFalse() }
  isEnemy() { return returnFalse() }
}
Piece.NULL_PIECE = new NullPiece()

abstract class RoyalPiece extends Piece {

}
abstract class OfficerPiece extends Piece {

}
class Rajendra extends RoyalPiece {
  static Type = new PieceType(SYMBOL.INDRA, 9, 1)
}