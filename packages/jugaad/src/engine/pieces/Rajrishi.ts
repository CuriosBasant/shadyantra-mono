import { Piece } from '.'
import { Board, Move, Square } from '../board'
import { Alliance } from '../player'
import { ADJACENT_DIRECTION } from '../Utils'


export default class Rajrishi extends Piece {
  adjacentOpponentOfficers = new Set<Piece>()
  constructor(position: number, alliance: Alliance) {
    super(Piece.RAJRISHI, position, alliance)
  }

  calculateLegalMoves(currentSquare: Square) {
    const moves: Move[] = []
    if (!currentSquare.isWarZone) {
      ADJACENT_DIRECTION.forEach(d => {
        const nextSquare = currentSquare.getNearbySquare(d)
        nextSquare?.createWeakMove(moves, currentSquare)
      })
      return moves
    }
    const loop = (direction: number, refSquare = currentSquare): Square => {
      const nextSquare = refSquare.getNearbySquare(direction)
      if (!nextSquare) return refSquare

      return nextSquare.createWeakMove(moves, currentSquare) ? nextSquare : loop(direction, nextSquare)
    }
    ADJACENT_DIRECTION.forEach(d => loop(d))
    return moves
  }

  /** Freezes all surrounding squares to the Rajrishi if no opponent royal is on them. */
  createMediateZone(board: Board) {
    this.loopSurrounding(board, (square: Square) => square.freeze())
  }
  controlOpponentOfficers(board: Board) {
    this.loopSurrounding(board, (square: Square) => {
      if (this.isEnemyOf(square.piece) && square.piece.isOfficer)
        this.adjacentOpponentOfficers.add(square.piece)
      square.addAttacker(this)
    })
  }
  private loopSurrounding(board: Board, fun: (square: Square) => void) {
    const currentSquare = this.square(board)
    if (currentSquare.isCastle || currentSquare.isForbiddenZone || currentSquare.isOpponentRoyalNearby()) return

    for (const relativeIndex of ADJACENT_DIRECTION) {
      const neighbourSquare = currentSquare.getNearbySquare(relativeIndex)! // fake !
      if (currentSquare.isZoneSame(neighbourSquare)) {
        fun(neighbourSquare)
      }
    }
  }
  moveTo(move: Move) {
    return new Rajrishi(move.destinationSquare.index, move.movedPiece.alliance)
  }
}