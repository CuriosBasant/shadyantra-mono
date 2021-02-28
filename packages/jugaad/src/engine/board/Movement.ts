import { Board, Builder, Square } from '.'
import { Piece, PieceFactory } from '../pieces'
import { Alliance } from '../player'

export default abstract class Move {
  private isExecuted = false;
  constructor(readonly sourceSquare: Square, readonly destinationSquare: Square) {

  }
  get movedPiece() {
    return this.sourceSquare.piece
  }
  protected getAlignmentCopy() {
    return this.destinationSquare.board.builder.copyAlignment()
  }
  execute() {
    this.isExecuted = true
    const configCopy = this.getAlignmentCopy()
    const builder = new Builder(configCopy)
      .setMoveMaker(this.opponentAlliance)
      .removePiece(this.movedPiece.position)
      .setPiece(this.movedPiece.moveTo(this))
    return builder.build()
  }

  takeback() {
    if (!this.isExecuted) throw new Error("This move has not been executed yet!")
    return this.destinationSquare.board
  }
  toString() {
    return `${ this.movedPiece.type.symbol }${ this.destinationSquare.name }`
  }
  get opponentAlliance() {
    return this.destinationSquare.board.opponentPlayer.alliance
  }
}
export class NormalMove extends Move {
  constructor(sourceSquare: Square, destinationSquare: Square) {
    super(sourceSquare, destinationSquare)
    destinationSquare.addAttacker(this.movedPiece)
  }
}
export class WeakMove extends Move {
}
export class AttackMove extends Move {
  get attackedPiece() {
    return this.destinationSquare.piece
  }
  toString() {
    return `${ this.movedPiece.type.symbol }x${ this.destinationSquare.name }`
  }
}
export class ControlMove extends Move {
}
export class SuicideMove extends Move {
  execute() {
    const configCopy = this.getAlignmentCopy()
    const builder = new Builder(configCopy)
      .removePiece(this.movedPiece.position)
    // .setPiece(this.movedPiece.moveTo(this));
    return builder.build()
  }
}

export abstract class MotionMove extends Move {
}
export class PromotionMove extends MotionMove {
  execute() {
    const insignia = this.destinationSquare.piece.getInsignia(1)
    const notation = this.destinationSquare.piece.alliance == Alliance.WHITE ? insignia.symbol : insignia.symbol.toLowerCase()
    const promotedPiece = PieceFactory.Create(notation, this.destinationSquare.index)
    const configCopy = this.getAlignmentCopy()
    const builder = new Builder(configCopy)
      .setMoveMaker(this.opponentAlliance)
      .setPiece(promotedPiece)
    return builder.build()
  }
}
export class DemotionMove extends MotionMove {
  execute() {
    const insignia = this.movedPiece.getInsignia(-1)
    const notation = this.movedPiece.alliance == Alliance.WHITE ? insignia.symbol : insignia.symbol.toLowerCase()
    const demotedPiece = PieceFactory.Create(notation, this.destinationSquare.index)
    const configCopy = this.getAlignmentCopy()
    const builder = new Builder(configCopy)
      .setMoveMaker(this.opponentAlliance)
      .removePiece(this.movedPiece.position)
      .setPiece(demotedPiece)
    return builder.build()
  }
}
