import { Component, createRef, CSSProperties } from 'react'
import { Board, Pieces } from '.'
import Shatranjan from '../engine'

const containerStyles: CSSProperties = {
  width: '100vmin',
  height: '100vmin',
}, TRAIL_PATH_CLASS = 'bg-lightBlue-200'
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
  protected abstract makeMove(from: string, to: string, isForced?: boolean): void
  state: IBoardState = {
    selectedSquare: null,
    squares: this.game.board.squares as (IPiece | null)[],
    validMoves: this.game.board.validMoves
  }
  // static getDerivedStateFromProps(props, state) {
  // }
  get game() {
    return this.props.game
  }
  protected lastMove: string | null = null
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
  private selectSquare(squareToSelect: string) {
    this.squareRefs.get(squareToSelect)!.classList.add('trail')
    this.showPath(squareToSelect)

    this.setState({ selectedSquare: squareToSelect })
  }
  private unselectSquare(removeClass = true) {
    const selectedSquare = this.state.selectedSquare
    removeClass && this.squareRefs.get(selectedSquare)!.classList.remove('trail')
    this.showPath(selectedSquare, false)

    this.setState({ selectedSquare: null })
  }
  private showPath(squareName: string, toShow = true) {
    for (const destSqName of this.state.validMoves[squareName]) {
      this.squareRefs.get(destSqName)!.classList.toggle('path', toShow)
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
      }
    } else {
      if (ev.shiftKey || validMoves[selectedSquare].includes(squareName as 'x0')) {
        this.makeMove(selectedSquare, squareName, ev.shiftKey)
        this.unselectSquare(false)
      } else if (selectedSquare != squareName && squareName in validMoves) {
        this.unselectSquare()
        this.selectSquare(squareName)
      } else {
        this.unselectSquare()
      }
    }
  }
  render() {
    return <div id='board-container' className='relative' style={ containerStyles }>
      <div className='absolute ml-1 flex flex-col justify-around h-full' style={ { fontSize: '2vmin' } }>{ '9876543210'.split('').map(ch => <span key={ ch } className='h-full'>{ ch }</span>) }</div>
      <div className='absolute bottom-0 flex justify-around w-full' style={ { fontSize: '2vmin' } }>{ 'xabcdefghy'.split('').map(ch => <span key={ ch } className='text-right mr-1 w-full'>{ ch }</span>) }</div>
      <Pieces pieces={ this.state.squares } />
      <Board ref={ this.boardRef } onSquareClick={ this.onSquareClick } />
    </div>
  }
}

class OfflineGame extends GameContainer {
  protected makeMove(from: string, to: string, isForced = false) {
    console.log(`Making Move ${ from }-${ to }`)
    this.lastMove?.split('-').forEach(s => {
      this.squareRefs.get(s)!.classList.remove('trail')
    })
    this.lastMove = `${ from }-${ to }`
    this.squareRefs.get(to)!.classList.add('trail')
    try {
      this.game.move({ from, to }, { isForced })
    } catch (error) {
      console.error(error.message)
    }
    const aa = this.game.board
    this.setState({ validMoves: aa.validMoves, squares: aa.squares })
  }
}

type BoardProps = {
  gameId?: string
  fen?: string
}
export default function BoardContainer({ gameId, fen }: BoardProps) {
  const game = Shatranjan.Create(gameId, fen)
  return <OfflineGame game={ game } />
}