import React, { CSSProperties, useEffect, useState } from 'react'
import Axios from 'axios'

interface IPiece {
  position: number
  notation: string
  name: string
  square: string
  side: 'WHITE' | 'BLACK'
}
interface ISquare {
  name: string
  piece: IPiece | null
  square: string
  notation: string
}

type Props = {
  pieces: ISquare[]
}

const FILES = 'xabcdefghy'
export default function Pieces({ pieces }: any) {

  return (
    <div id="pieces" className='absolute bottom-0 pointer-events-none select-none w-1/10 h-1/10 z-10' style={ { fontSize: '5vmin' } }>
      {pieces.map(piece => piece && <Piece key={ piece.square } { ...piece } square={ piece.square } />) }
    </div>
  )
}

const Piece = React.memo(({ notation, name, square }: IPiece) => {
  const X = FILES.indexOf(square[0]), Y = -square[1]
  return <span className='absolute duration-1000 flex w-full h-full font-mono transition-transform' style={ { transform: `translate(${ X }00%, ${ Y }00%)` } }>
    <span className="piece m-auto" title={ name }>{ notation }</span>
  </span>
}, () => true)
