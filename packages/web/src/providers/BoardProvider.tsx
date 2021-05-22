import React, { createContext, useContext } from "react"
import { useImmerReducer } from "use-immer"

/* -----------x Reducer x----------- */
export enum BoardActions {
  MovePiece = "MOVE_PIECE",
  Click = "SQUARE_CLICK",
  Empty = "EMPTY_BOARD",
  PutPiece = "PUT_PIECE",
  MarkMove = "MARK_MOVE",
  Clear = "BOARD_CLEAR",
  Reset = "BOARD_RESET",
  LoadFen = "LOAD_FEN",
}

function loadFen(squares: SquareData[], fen: string) {
  let index = 0
  for (const row of fen.split("/")) {
    let r = 0
    for (const ch of row) {
      // r += NaN or 0 || NaN || 1
      const maybeNum = +ch || +ch + 10 || 1
      r += maybeNum
      if (r > 10) throw new RangeError("Row exceeded!")

      if (isNaN(+ch)) {
        const upper = ch.toUpperCase()
        squares[index].piece = (upper + (ch == upper ? "W" : "B")) as ""
        index++
      } else {
        for (let i = 0; i < maybeNum; i++) {
          squares[index].piece = ""
          index++
        }
      }
    }
  }
}

type BoardActionEvent = {
  type: BoardActions
  payload?: Record<string, any>
}
function Reducer(draft: IBoard, action: BoardActionEvent) {
  switch (action.type) {
    case BoardActions.MovePiece:
      if (draft.squares[action.payload!.from].piece) {
        draft.squares[action.payload!.to].piece = draft.squares[action.payload!.from].piece
        draft.squares[action.payload!.from].piece = ""
      }
      break
    case BoardActions.PutPiece:
      draft.squares[action.payload!.index].piece = action.payload!.piece
      break
    case BoardActions.MarkMove:
      draft.squares[action.payload!.index].moves = action.payload!.mark
      break
    case BoardActions.Clear:
      if (action.payload.clear == "all") {
        for (const square of draft.squares) {
          square.piece = ""
          square.moves = ""
        }
      } else {
        for (const square of draft.squares) {
          square[action.payload.clear] = ""
        }
      }
      break
    case BoardActions.Reset: {
      const defaultFen = "1c2ia2c1/cmhgrsghmc/cppppppppc/0/0/0/0/CPPPPPPPPC/CMHGSRGHMC/1C2AI2C1"
      loadFen(draft.squares, defaultFen)
      draft.fen = defaultFen
      return draft
    }
    case BoardActions.LoadFen:
      try {
        loadFen(draft.squares, action.payload.fen)
      } catch (error) {
        console.error(error)
      }
      draft.fen = action.payload.fen
      return draft
    case BoardActions.Empty:
      draft.squares = init().squares
      break

    default:
      return draft
  }
  let lastCharAt = -1
  draft.fen = draft.squares
    .reduce((str, { piece }, i) => {
      if (piece) {
        str +=
          (i - lastCharAt == 1 ? "" : i - lastCharAt - 1) +
          (piece[1] == "W" ? piece[0] : piece[0].toLowerCase())
        lastCharAt = i
      }
      if (i % 10 == 9) {
        str += (i - lastCharAt == 10 ? "0" : i - lastCharAt || "") + "/"
        lastCharAt = i
      }
      return str
    }, "")
    .slice(0, -1)
  return draft
}

/* --------------------------------- */
type PieceSymbols = "P" | "G" | "H" | "M" | "S" | "C" | "R" | "A" | "I"
export type SquareData = {
  index: number
  piece: "" | `${PieceSymbols}${"W" | "B"}`
  type: 0 | 1 | 2 | 3
  // type: "forbidden" | "castle" | "battlefield" | "truce"
  moves?: any
}
type IBoard = {
  squares: SquareData[]
  fen: string
}

const INITIAL_STATE: IBoard = {
  squares: [],
  fen: "",
}

type Props = {
  children: React.ReactNode
}
export const BoardContext = createContext({
  state: INITIAL_STATE,
  dispatch: (() => null) as React.Dispatch<BoardActionEvent>,
})
function init(): IBoard {
  return {
    fen: "0/".repeat(10).slice(0, -1),
    squares: Array.from<number, SquareData>(Array(100), (_, i) => {
      const row = ((i / 10) | 0) % 9,
        col = (i % 10) % 9
      return {
        index: i,
        piece: "",
        // type: row ? (col ? "battlefield" : "truce") : col ? "castle" : "forbidden",
        type: parseInt(`${+!!row}${+!!col}`, 2) as 0,
      }
    }),
  }
}
export function BoardProvider({ children }: Props) {
  const [state, dispatch] = useImmerReducer(Reducer, INITIAL_STATE, init)
  // const value = {}
  return <BoardContext.Provider value={{ state, dispatch }}>{children}</BoardContext.Provider>
}
export function useBoard() {
  return useContext(BoardContext)
}
