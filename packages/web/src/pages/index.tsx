import { useEffect } from "react"
import { Board } from "../components/shadyantra"
import { useBoard, BoardProvider, BoardActionTypes } from "../providers/BoardProvider"

function Container() {
  const { state, dispatch } = useBoard()
  const onSquareClick = (index: number) => {
    console.log(index)
  }
  useEffect(() => {
    dispatch({ type: BoardActionTypes.Empty })
  }, [])
  return <Board squares={state.squares} onSquareClick={onSquareClick} />
}

export default function Root() {
  return (
    <BoardProvider>
      <Container />
    </BoardProvider>
  )
}
