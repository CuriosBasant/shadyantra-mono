import { CSSProperties, forwardRef } from 'react'
// import cn from 'classnames'

const files = 'xabcdefghy', oneMinus = 9

const classes = {
  'war-zone': 'bg-yellow-200',
  'truce-zone': 'bg-green-300',
  'forbidden-zone': 'bg-red-400',
  'castle': 'bg-pink-400'
}
function Square({ index, onSquareClick }) {
  const file = index % 10, rank = index / 10 | 0
  const squareType = rank % oneMinus ?
    file % oneMinus ? 'war-zone' : `truce-zone` :
    file % oneMinus ? 'castle' : 'forbidden-zone',
    squareName = `${ files[file] }${ oneMinus - rank }`

  return <button
    onClick={ onSquareClick }
    className={ `relative bg-opacity-50 ${ classes[squareType] }` }
    data-square-name={ squareName }
    title={ squareName }
    type='button'
  />
}

const boardStyles: CSSProperties = {
  background: 'center / 20% url(../assets/board-background-checker.png) #0002'
}
type BoardProps = {
  onSquareClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
export default forwardRef<HTMLDivElement, BoardProps>(({ onSquareClick }, ref) =>
  <div ref={ ref } id='board' className='grid grid-cols-10 h-full' style={ boardStyles }>
    { Array.from(Array(100), (_, i) => <Square key={ i } index={ i } onSquareClick={ onSquareClick } />) }
  </div>
)
