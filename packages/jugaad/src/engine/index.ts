// import { EventEmitter } from 'events'
import { nanoid } from "nanoid"
import { Board, Builder, SquareName, SQUARE_FLAGS } from './board'
import ShadYantra from './board/ShadYantra'
import { PieceFactory } from './pieces'
import { Alliance } from './player'
import { DEFAULT_FEN, TOTAL_SQUARES } from './Utils'
interface Options {
  switchTurn: boolean
  variant: string
}

// export enum EVENT { MOVE = 'move', END = 'end', START = 'start', READY = 'ready', DEBUG = 'debug' };

type MoveObject = {
  from: string | number,
  to: string | number
}
type IPiece = {
  // position: number
  notation: string
  name: string
  square: string
  side: 'w' | 'b'
}
// type I_Moves = Partial<Record<SquareName, SquareName[]>>
type IMoves = Record<string, SquareName[]>
// type IMoves = Pick<I_Moves, SquareName>

export default class Shatranjan {
  private _board!: Board
  readonly isGameOver = false
  readonly isDraw = false
  readonly isCheckmate = false
  readonly isStalemate = false
  // private validMoves

  constructor(readonly gameId: string, fen = DEFAULT_FEN, { } = {} as Options) {
    this.loadFEN(fen)
  }

  static GAME_LOOP = new Map<string, Shatranjan>();
  static Create(gameId = nanoid(8), fen?: string) {
    let game = Shatranjan.GAME_LOOP.get(gameId)
    if (!game) {
      game = new Shatranjan(gameId, fen)
      Shatranjan.GAME_LOOP.set(gameId, game)
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
      current: this._board.getSquareWithName(f)!,
      destination: this._board.getSquareWithName(t)!,
    }
    if (!square.current || !square.destination || square.current == square.destination)
      throw new Error("Invalid Square Provided!")
    if (square.current.isEmpty)
      throw new Error("The Origin Square is Empty.")
    return square
  }
  move(moveStr: string | MoveObject, { isSloppy = true, isForced = false } = {}) {
    const { current, destination } = this.parseMove(moveStr)
    const selectedPieceMoves = this._board.activePlayer.moves.get(current)
    if (!selectedPieceMoves) throw new Error("It's not your turn!")

    const move = selectedPieceMoves.find(move => move.destinationSquare == destination)
    if (!move) {
      return console.error('Invalid move')
    }
    this._board = move.execute()
  }
  undo() {

  }
  getMoves(): IMoves
  getMoves(squareName: string): SquareName[] | null
  getMoves(squareName?: string) {
    if (squareName) {
      const square = this._board.getSquareWithName(squareName as SquareName)
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
    const builder = new Builder().setMoveMaker(Alliance.GET_ALLIANCE['w'])
    for (let index = 0; index < TOTAL_SQUARES; index++) {
      if (fen[index] == '.') continue
      builder.setPiece(PieceFactory.Create(fen[index], index))
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
    const squares = this._board.squares.map(({ name }) => this.getPiece(name))
    return { squares, validMoves: this.getMoves() }
  }
  getPiece(squareName: string): IPiece | null {
    const square = this._board.squareMap.get(squareName as 'x0')
    if (!square) throw new Error("Invalid Square Name Provided")
    const piece = square.piece
    return piece.isNull ? null : {
      square: squareName,
      name: piece.type.name,
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


const _Shatranjan = {
  Create(fen?: string, { switchTurn = true, variant = 'shadyantra' } = {} as Options) {
    return new ShadYantra(fen)
  },
  GamePool: new Map<string, ShadYantra>(),
  saveGame(game: ShadYantra) {
    const id = Date.now().toString()
    this.GamePool.set(id, game)
    return id
  },
  CreateSavedGame(fen?: string, options = {} as Options) {
    return this.saveGame(this.Create(fen, options))
  },
  RetrieveGame(id: string) {
    return this.GamePool.get(id)
  }
}

/*

Variant Notes
- King could be checked
- Freezed Officers could be sent to FZ
- Introduce new Sadhu pieces
- When no A in game, remove pawns if no O is nearby
- Game is not finished when king goes to TZ while offering draw

*/