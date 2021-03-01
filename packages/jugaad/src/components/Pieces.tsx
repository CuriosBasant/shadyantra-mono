import React from 'react'
import { IPiece } from '../engine'

type Props = {
  pieces: IPiece[]
  isStroke: boolean
}

const FILES = 'xabcdefghy', PIECE_UNICODE_SYMBOL = {
  P: '♙', G: '♗', H: '♘', M: '♖', S: '♕', A: '♤', C: '☆', I: '♔', R: '⚐',
  p: '♟︎', g: '♝', h: '♞', m: '♜', s: '♛', a: '♠', c: '★', i: '♚', r: '⚑',
}
export default function Pieces({ pieces, isStroke }: Props) {
  return (
    <div id="pieces" className='absolute bottom-0 pointer-events-none select-none w-1/10 h-1/10 z-10' style={ { fontSize: '7vmin' } }>
      {isStroke ? pieces.map(piece => <PieceStroke key={ piece.square } { ...piece } square={ piece.square } />) :
        pieces.map(piece => <PieceNoStroke key={ piece.square } { ...piece } square={ piece.square } />) }
    </div>
  )
}

const PieceNoStroke = ({ notation, name, square }: IPiece) => {
  const X = FILES.indexOf(square[0]), Y = -square[1]
  return <span className='absolute duration-1000 flex w-full h-full font-mono transition-transform' style={ { transform: `translate(${ X }00%, ${ Y }00%)` } }>
    <span className={ "piece m-auto text-gray-800" } title={ name }>{ PIECE_UNICODE_SYMBOL[notation] }</span>
  </span>
}
const PieceStroke = ({ notation, name, square }: IPiece) => {
  const X = FILES.indexOf(square[0]), Y = -square[1], symbol = notation.toLowerCase()
  return <span className='absolute duration-1000 flex w-full h-full font-mono transition-transform' style={ { transform: `translate(${ X }00%, ${ Y }00%)`, 'WebkitTextStroke': '.1vmin #333' } }>
    <span className={ `piece m-auto ${ notation == symbol ? 'text-gray-800' : 'text-white' }` } title={ name }>{ PIECE_UNICODE_SYMBOL[symbol] }</span>
  </span>
}
