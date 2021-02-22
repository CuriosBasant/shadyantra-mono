// @ts-nocheck
import React, { createContext, ReactChild, ReactChildren, useContext, useMemo, useRef } from 'react'
import Axios from 'axios'
import { useImmerReducer } from 'use-immer'
import Shatranjan from "@shadyantra/core"

enum BOARD_EVENTS { LOAD_GAME = 'LOAD_GAME', NEW_GAME = 'NEW_GAME', MAKE_MOVE = 'MAKE_MOVE' };
// const BOARD_EVENTS = { LOAD_GAME: 0, NEW_GAME: 1 };
type IPiece = {
  position: number
  notation: string
  name: string
  squareName: string
  side: 'WHITE' | 'BLACK'
}
type IBoardStatus = {
  gameId: string
  squares: {
    name: string
    piece: IPiece | null
  }[]
  validMoves: Record<string, string[]>
}
type IBoardAction = {
  type: BOARD_EVENTS
  payload?: any
}
type IBoard = {
  State: IBoardStatus
  Dispatcher: BoardDispatch//React.Dispatch<IBoardAction>;
}
type Props = {
  children: ReactChild | ReactChildren
  fen: string
  gameId: string
}

export const BoardContext = createContext({} as IBoard)

export class BoardDispatch {
  constructor(readonly Dispatch: React.Dispatch<IBoardAction>) {
  }
  static Actions = new Map<BOARD_EVENTS, (draft: IBoardStatus, payload: any) => void>()
    // .set(BOARD_EVENTS.LOAD_GAME, (draft, payload) => draft.status = payload)
    // .set(BOARD_EVENTS.NEW_GAME, (draft, payload) => draft.gameId = payload)
    .set(BOARD_EVENTS.MAKE_MOVE, (draft, payload) => {
      draft.squares = payload.squares
      draft.validMoves = payload.validMoves
    })
    ;
  static Reducer(draft: IBoardStatus, action: IBoardAction) {
    const actionToExecute = BoardDispatch.Actions.get(action.type)
    actionToExecute && actionToExecute(draft, action.payload)
  }
  newGame(payload: any) {
    this.Dispatch({ type: BOARD_EVENTS.NEW_GAME, payload })
  }
  loadGame(payload: any) {
    // console.log('from load', BOARD_EVENTS.LOAD_GAME);
    this.Dispatch({ type: BOARD_EVENTS.LOAD_GAME, payload })
  }
  async makeMove(gameId, obj) {
    const data = await Axios.post(`http://localhost:3000/api/games/${ gameId }`, { data: obj })
    this.Dispatch({ type: BOARD_EVENTS.MAKE_MOVE, payload: data.data })
    console.log(data.data, obj)
  }
}
export function BoardProvider({ fen, gameId, children }: Props) {
  const game = Shatranjan.Create(gameId, fen)
  const [State, Dispatch] = useImmerReducer<IBoardStatus, IBoardAction>(BoardDispatch.Reducer, status)
  const value = useMemo(() => ({ State, Dispatcher: new BoardDispatch(Dispatch) }), [State])
  return (
    <BoardContext.Provider value={ value }>{ children }</BoardContext.Provider>
  )
}
export function useBoard() {
  return useContext(BoardContext)
}