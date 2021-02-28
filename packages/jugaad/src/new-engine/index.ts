import { Board, BoardBuilder } from './board'
import { SquareName } from './board/Square'
import { Piece } from './pieces'
import { Alliance } from './player'
import { DEFAULT_FEN, SQUARE_FLAGS, TOTAL_SQUARES } from './Utils'

export default class Shadyantra {
  private _board!: Board
  readonly isGameOver = false
  readonly isDraw = false
  readonly isCheckmate = false
  readonly isStalemate = false
  // private validMoves

  constructor(readonly gameId: string, fen = DEFAULT_FEN, { } = {} as Options) {
    this.loadFEN(fen)
  }

  static GAME_LOOP = new Map<string, Shadyantra>();
  static Create(gameId = nanoid(8), fen?: string) {
    let game = Shadyantra.GAME_LOOP.get(gameId)
    if (!game) {
      game = new Shadyantra(gameId, fen)
      Shadyantra.GAME_LOOP.set(gameId, game)
    }
    return game
  }

  private parseMove(squareRef: string | MoveObject) {
    let f: SquareName, t: SquareName
    if (typeof squareRef == 'string') {
      f = squareRef.slice(0, 2) as SquareName
      t = squareRef.slice(2) as SquareName
    } else {
      const toSquareName = (v: string | number) => typeof v == 'number' ? SQUARE_FLAGS[v] : v
      f = toSquareName(squareRef.from) as SquareName
      t = toSquareName(squareRef.to) as SquareName
    }

    const square = {
      current: this._board.getSquareByName(f)!,
      destination: this._board.getSquareByName(t)!,
    }
    if (!square.current || !square.destination)
      throw new Error("Invalid Square Provided!")
    if (square.current.isEmpty)
      throw new Error("The Origin Square is Empty.")
    return square
  }
  move(moveStr: string | MoveObject, { isSloppy = true, isForced = false } = {}) {
    const { current, destination } = this.parseMove(moveStr)
    const selectedPieceMoves = this._board.moves.get(current)
    if (!selectedPieceMoves) throw new Error("It's not your turn!")
    let move: Move
    if (isForced) {
      if (current == destination) throw new Error("Can't force move on same square")
      // move = new NormalMove(current, destination)
    } else {
      move = selectedPieceMoves.find(move => move.destinationSquare == destination)
      if (!move) throw new Error('Invalid move')
    }
    this._board = move.execute()
  }
  undo() {

  }
  getMoves(): IMoves
  getMoves(squareName: string): SquareName[] | null
  getMoves(squareName?: string) {
    if (squareName) {
      const square = this._board.getSquareByName(squareName)
      if (!square) throw new Error(`Square with name ${ squareName } doesnot exist`)
      if (square.isEmpty) throw new Error("That square has no piece on it.")
      return this._board.activePlayer.moves.get(square)?.map(move => move.destinationSquare.name) ?? null
    }

    const moves: IMoves = {}
    this._board.activePlayer.moves.forEach((moveArr, sourceSquare) => {
      moves[sourceSquare.name] = moveArr.map(move => move.destinationSquare.name)
    })
    return moves
  }
  loadFEN(fen: string) {
    const builder = new BoardBuilder().setMoveMaker(Alliance.GET_ALLIANCE['w'])
    for (let index = 0; index < TOTAL_SQUARES; index++) {
      if (fen[index] == '.') continue
      builder.setPiece(Piece.Create(fen[index], index))
    }
    this._board = builder.build()
  }
  loadPGN() {

  }
  get FEN() {
    return this._board.builder.config.reduce((str, piece) => str + piece.notation, '')
  }
  get PGN() {
    return ''
  }
  get board() {
    const pieces: Record<string, IPiece> = {}
    this._board.squares.forEach(({ name }) => {
      const piece = this.getPiece(name)
      if (piece) {
        pieces[name] = piece
      }
    })
    return { pieces, validMoves: this.getMoves() }
  }
  getPiece(squareName: string): IPiece | null {
    const square = this._board.getSquareByName(squareName)
    if (!square) throw new Error("Invalid Square Name Provided")
    const piece = square.piece
    return piece.isNull ? null : {
      square: squareName,
      name: piece.type.name,
      nickname: piece.type.nickname,
      notation: piece.notation,
      side: piece.alliance.symbol
    }
  }
  putPiece(notation: string, squareName: string) {

  }
  removePiece(squareName: string) {

  }
  reset() {
    this.loadFEN(DEFAULT_FEN)
  }
  history() {

  }
  turnOf() {

  }
  clear() {

  }
  toString() {

  }
}