import { Component, createRef, CSSProperties } from 'react'
import firebase from "firebase"
import { Board, Pieces } from '.'
import { BoardContext } from '../providers'
import Shatranjan from "@shadyantra/core"
import { database } from '../firebase'

const containerStyles: CSSProperties = {
  width: '100vmin',
  height: '100vmin',
}
type IPiece = {
  // position: number
  notation: string
  name: string
  square: string
  side: 'w' | 'b'
}
type Props = {
  game: Shatranjan
}
type IBoardState = {
  selectedSquare: string | null
  squares: (IPiece | null)[]
  validMoves: Record<string, string[]>
}

abstract class GameContainer extends Component<Props, IBoardState> {
  protected abstract makeMove(from: string, to: string): void
  state = {
    selectedSquare: null,
    squares: this.game.board.squares as (IPiece | null)[],
    validMoves: this.game.board.validMoves
  }
  // static getDerivedStateFromProps(props, state) {
  // }
  get game() {
    return this.props.game
  }
  private boardRef = createRef<HTMLDivElement>();
  protected squareRefs = new Map<string, HTMLButtonElement>();
  private isMyTurn = false;

  componentDidMount() {
    // @ts-ignore
    const squareElements = Array.from<HTMLButtonElement>(this.boardRef.current!.children)
    for (const squareElement of squareElements) {
      this.squareRefs.set(squareElement.dataset.squareName!, squareElement)
    }
  }
  private selectSquare(selectedSquare = null) {
    this.setState({ selectedSquare })
  }
  private togglePath(squareName: string, bool: boolean) {
    this.squareRefs.get(squareName)!.classList.toggle('selected', bool)
    for (const destSqName of this.state.validMoves[squareName]) {
      this.squareRefs.get(destSqName)!.classList.toggle('path', bool)
    }
  }

  private onSquareClick = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const squareName = ev.currentTarget.dataset.squareName
    if (!squareName) throw new Error("Invalid SquareName")

    const { selectedSquare, squares, validMoves } = this.state
    // const sqrObj = squares.find(sqr => sqr?.square == squareName)
    // if (!sqrObj) return console.log("No square found")

    if (selectedSquare == null) {
      if (squareName in validMoves) {  // is valid select
        this.selectSquare(squareName)
        this.togglePath(squareName, true)
      }
    } else {
      if (selectedSquare == squareName) {
      } else if (validMoves[selectedSquare].includes(squareName as 'x0')) {  // is valid destination
        this.makeMove(selectedSquare, squareName)
      } else if (squareName in validMoves) { // own piece
        setTimeout(() => this.squareRefs.get(squareName)!.click())
      }
      this.togglePath(selectedSquare, false)
      this.selectSquare()
    }
  }
  render() {
    return <div id='board-container' className='relative' style={ containerStyles }>
      <Pieces pieces={ this.state.squares } />
      <Board ref={ this.boardRef } onSquareClick={ this.onSquareClick } />
    </div>
  }
}

class OfflineGame extends GameContainer {
  protected makeMove(from: string, to: string) {
    console.log(`Making Move ${ from }-${ to }`)
    try {
      this.game.move({ from, to })
    } catch (error) {
      console.error(error.message)
    }
    const aa = this.game.board
    this.setState({ validMoves: aa.validMoves, squares: aa.squares })
  }
}
class OnlineGame extends GameContainer {
  private firebaseDoc = database.boards.doc(this.game.gameId);
  private firebaseSnapshot: () => void
  private isGameStarted = false;

  componentDidMount() {
    this.firebaseSnapshot = this.firebaseDoc.onSnapshot(snapshot => {
      // console.log('it old run')
      if (!this.isGameStarted) return this.isGameStarted = true
      const data = snapshot.data()
      const [from, to] = data.moves[data.moves.length - 1].split('-')
      console.log(`Making Move ${ from }-${ to }`)
      // console.log(snapshot.data().moves)
      try {
        this.game.move({ from, to })
      } catch (error) {
        console.error(error.message)
      }
      // const aa = this.game.board
      this.setState({ ...this.game.board })
    }, console.error)

    super.componentDidMount()
  }
  componentWillUnmount() {
    this.firebaseSnapshot()
  }
  protected makeMove(from: string, to: string) {
    // console.log(`Making Move ${ from }-${ to }`)

    this.firebaseDoc.update({
      moves: firebase.firestore.FieldValue.arrayUnion(`${ from }-${ to }`)
    })
  }
}

type BoardProps = {
  gameId?: string
  fen?: string
}
export default function BoardContainer({ gameId, fen }: BoardProps) {
  const game = Shatranjan.Create(gameId, fen)
  return gameId ? <OnlineGame game={ game } /> : <OfflineGame game={ game } />
}