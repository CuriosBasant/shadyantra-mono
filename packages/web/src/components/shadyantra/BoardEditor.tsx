import React, { Component, useEffect, useRef, useState } from "react"
import { Icon } from "../../components"
import { Board } from "../../components/shadyantra"
import { database } from "../../firebase"
import { BoardActions, BoardContext, BoardProvider } from "../../providers/BoardProvider"

type SpareProp = {
  setSelectedPiece: (piece: string) => void
  color: "W" | "B"
  selectedPiece: string
}
function Spare({ color, selectedPiece, setSelectedPiece }: SpareProp) {
  // const [piece, setPiece] = useState("")
  return (
    <div className="flex items-stretch bg-gray-300 border rounded shadow-inner">
      {["I", "A", "C", "R", "S", "M", "G", "H", "P"].map((ch) => {
        const symbol = ch + color
        return (
          <button
            key={symbol}
            className={` relative flex-1 transition-colors rounded focus:outline-none p-1 ${
              selectedPiece == symbol ? "bg-blue-300" : "hover:bg-gray-400"
            }`}
            data-piece={symbol}
            onClick={(ev) =>
              setSelectedPiece(selectedPiece == symbol ? "" : ev.currentTarget.dataset.piece)
            }
          >
            <img src={`/assets/pieces/${symbol}.svg`} alt={symbol} />
          </button>
        )
      })}
      <button className="flex-1"></button>
    </div>
  )
}

type StateType = {
  pieceToPut: string
  isFlipped: boolean
}
export class BoardEditor extends Component<{ isOffline: boolean }, StateType> {
  static contextType = BoardContext
  // static defaultProps = {}
  context: React.ContextType<typeof BoardContext>
  private editorDoc: ReturnType<typeof database.devs.doc>
  private snapshotCancel = () => {}

  readonly state: StateType = {
    pieceToPut: "",
    isFlipped: false,
  }

  constructor(props) {
    super(props)
    // @ts-ignore
    this.editorDoc = props.isOffline
      ? {
          set: (data) => {
            this.context.dispatch({ type: data.action, payload: data })
          },
        }
      : database.devs.doc("editor")
  }

  async componentDidMount() {
    if (this.props.isOffline) return
    await this.editorDoc.set({})
    this.snapshotCancel = this.editorDoc.onSnapshot((snapshot) => {
      if (!snapshot.exists) return
      const data = snapshot.data()
      this.context.dispatch({ type: data.action, payload: data })
    }, console.error)
  }
  componentWillUnmount() {
    this.snapshotCancel()
  }

  onSquareClick = (index: number, sPiece?: number | string) => {
    const square = this.context.state.squares[index]
    if (sPiece == undefined) {
      if (!this.state.pieceToPut) {
        if (!square.piece) return
      }
      sPiece = this.state.pieceToPut
    } else {
      this.editorDoc.set({ action: BoardActions.MovePiece, from: sPiece, to: index })
      return
    }

    if (sPiece.toUpperCase() == sPiece) {
      const piece = sPiece == square.piece ? "" : sPiece
      this.editorDoc.set({ action: BoardActions.PutPiece, index, piece })
    } else {
      const mark = sPiece == square.moves ? "" : sPiece
      this.editorDoc.set({ action: BoardActions.MarkMove, index, mark })
    }
  }
  selectPiece = (piece: string) => {
    this.setState({ pieceToPut: piece })
  }
  reset = () => {
    this.editorDoc.set({ action: BoardActions.Reset })
  }
  flip = () => {
    // this.setState({ isFlipped: data.value })
  }
  clearBoard(all: string) {
    this.editorDoc.set({ action: BoardActions.Clear, clear: all })
  }
  loadFEN = (fen: string) => {
    console.log("loading fen", fen)
    this.editorDoc.set({ action: BoardActions.LoadFen, fen })
  }
  render() {
    const { pieceToPut, isFlipped } = this.state,
      { state } = this.context
    return (
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 h-screen p-4 space-y-4 lg:p-0">
          <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 10fr" }}>
            <div className=""></div>
            <Spare color="B" selectedPiece={pieceToPut} setSelectedPiece={this.selectPiece} />
            <div className="flex-shrink-0 bg-gray-300 border rounded shadow-inner">
              <div className="flex flex-col items-stretch h-full">
                {["circle", "plus", "x", "exclamation"].map((cls, i) => (
                  <button
                    key={i}
                    className={`h-1/10 transition-colors ${
                      pieceToPut == cls ? "bg-blue-300" : "hover:bg-gray-400"
                    } focus:outline-none rounded `}
                    onClick={() => this.selectPiece(cls)}
                  >
                    <Icon name={cls as "x"} className="w-1/2 mx-auto text-gray-700" outline={!!i} />
                  </button>
                ))}
                <div className="flex-1"></div>
                <button
                  className={`h-1/10 ${
                    !pieceToPut ? "bg-red-200" : "hover:bg-red-200"
                  } focus:outline-none rounded `}
                  onClick={() => this.selectPiece("")}
                >
                  <Icon name="trash" className="w-1/2 mx-auto text-red-500" />
                </button>
              </div>
            </div>
            <Board squares={state.squares} onSquareClick={this.onSquareClick} flip={isFlipped} />
            <div className=""></div>
            <Spare color="W" selectedPiece={pieceToPut} setSelectedPiece={this.selectPiece} />
          </div>
        </div>
        <div className="flex-shrink-0 p-4 mt-10 space-y-4 text-sm md:w-2/5">
          <div className="flex items-center space-x-2 font-bold text-gray-800">
            <span>CLEAR</span>
            <button
              className="px-4 py-1 transition transform bg-white border rounded shadow hover:bg-gray-200 hover:-translate-y-0.5"
              onClick={() => this.clearBoard("all")}
            >
              All
            </button>
            <button
              className="px-4 py-1 transition transform bg-white border rounded shadow hover:bg-gray-200 hover:-translate-y-0.5"
              onClick={() => this.clearBoard("piece")}
            >
              Pieces
            </button>
            <button
              className="px-4 py-1 transition transform bg-white border rounded shadow hover:bg-gray-200 hover:-translate-y-0.5"
              onClick={() => this.clearBoard("moves")}
            >
              Moves
            </button>
          </div>
          <div className="flex items-center space-x-2 font-bold text-gray-800">
            <span>BOARD</span>
            <button
              className="px-4 py-1 transition transform bg-white border rounded shadow hover:bg-gray-200 hover:-translate-y-0.5"
              onClick={this.reset}
            >
              Reset
            </button>
            <button
              className={`px-4 py-1 transition transform ${
                isFlipped ? "bg-blue-400 text-white" : "border bg-white hover:bg-gray-200"
              }  rounded shadow hover:-translate-y-0.5`}
              onClick={this.flip}
            >
              Flip
            </button>
            <button
              className="hidden px-4 py-1 transition transform bg-white border rounded shadow hover:bg-gray-200 hover:-translate-y-0.5"
              onClick={null}
            >
              Dunno
            </button>
          </div>
          <JoBhiHai label="FEN" text={state.fen} fenLoader={this.loadFEN} />
        </div>
      </div>
    )
  }
}

type JoProp = {
  label: string
  text: string
  fenLoader: (fen: string) => void
}
function JoBhiHai({ label, text, fenLoader }: JoProp) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fen, setFEN] = useState(text)
  const [textCopied, setTextCopied] = useState(false)

  const onSubmit: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    if (fen == text) {
      inputRef.current.select()
      document.execCommand("copy")
      inputRef.current.setSelectionRange(0, 0)
      inputRef.current.blur()
      setTextCopied(true)
      return
    } else {
      fenLoader(inputRef.current.value)
    }
  }
  const onTextChang: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    setFEN(ev.currentTarget.value)
  }
  useEffect(() => {
    setFEN(text)
  }, [text])
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-800">
      <label className="font-bold ">{label}</label>
      <input
        className="flex-1 py-1 font-mono text-sm text-gray-600 bg-gray-100 border rounded shadow-inner"
        ref={inputRef}
        value={fen}
        onChange={onTextChang}
        type="text"
        placeholder="Enter fen string"
        spellCheck={false}
      />
      <button
        onBlur={() => setTimeout(() => setTextCopied(false), 3000)}
        className="px-3 border py-1 bg-white rounded cursor-[copy] shadow"
        onClick={onSubmit}
      >
        {fen != text ? "Load" : textCopied ? "Copied!" : "Copy"}
      </button>
    </div>
  )
}
