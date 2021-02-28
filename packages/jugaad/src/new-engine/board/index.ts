import { Piece } from '../pieces'
import { Alliance } from '../player'
import { ADJACENT_DIRECTION, SQUARE_FLAGS, TOTAL_SQUARES } from '../Utils'
import { Move } from './Movement'
import { Square } from './Square'
export * from './Movement'

export type Files = 'x' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'y'
export type Ranks = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export class Board {
  squares = new Map<string, Square>()
  moves = new Map<Square, Move>()
  activeAlliance = Alliance.WHITE
  opponentAlliance = Alliance.WHITE
  rajrishi
  constructor(private readonly builder: BoardBuilder) {
    this.generateBoard()

  }
  private generateBoard() {
    // Create Squares
    for (let i = 0; i < TOTAL_SQUARES; i++) {
      const square = Square.Create(this, i)
      this.squares.set(square.name, square)
    }
    // Creating a mesh of pieces
    for (const square of this.squares.values()) {
      if (square.isExplored) continue
      for (const relativeIndex of ADJACENT_DIRECTION) {
        const vicinitySquare = square.getVicinityZone(relativeIndex)
        square.addVicinityPiece(vicinitySquare?.piece)
        vicinitySquare.addVicinityPiece(square.piece)
      }
      square.isExplored = true
    }
  }
  private filterPieces() {

  }
  getSquareAt(index: number) {
    return this.squares.get(SQUARE_FLAGS[index])
  }
  getSquareByName(name: string) {
    return this.squares.get(name)
  }
  get activePieces() {
    return
  }
  get pieces() {
    return this.builder.config
  }
  get inActiveAlliance() {
    return this.activeAlliance.other
  }
}

export class BoardBuilder {
  private moveMaker = Alliance.WHITE;
  constructor(public config = Array<Piece>(TOTAL_SQUARES).fill(Piece.NULL_PIECE)) {
  }

  setPiece(piece: Piece) {
    this.config[piece.position] = piece
    return this
  }
  removePiece(index: number) {
    this.config[index] = Piece.NULL_PIECE
    return this
  }
  setMoveMaker(alliance: Alliance) {
    this.moveMaker = alliance
    return this
  }
  copyAlignment() {
    return this.config.slice()
  }

  build() {
    return new Board(this)
  }
}