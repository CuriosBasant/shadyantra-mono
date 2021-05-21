import Image from "next/image"
import React from "react"
import { Icon } from ".."
import { SquareData } from "../../providers/BoardProvider"

type BoardProp = {
  // selectedPiece: string
  squares: SquareData[]
  onSquareClick: (index: number) => void
  flip?: boolean
}
export function Board({ squares, onSquareClick, flip = false }: BoardProp) {
  // const [isDragging, setDragging] = useState(true)
  return (
    <div
      onFocus={() => console.log()}
      className="relative overflow-hidden rounded shadow-md"
      style={{ paddingBottom: "100%" }}
      // onMouseMove={(ev) => {
      //   if (!cursorRef.current) return
      //   cursorRef.current.style.left = `${ev.clientX - ev.currentTarget.offsetLeft}px`
      //   cursorRef.current.style.top = `${ev.clientY - ev.currentTarget.offsetTop}px`
      // }}
    >
      <div
        className={
          "absolute inset-0 grid grid-cols-10 mx-auto bg-gray-300 bg-blend-overlay auto-rows-fr fodcus:cursor-[grabbing] "
        }
        style={{
          backgroundImage: "url(/assets/board-background-checker.png)",
          backgroundSize: "20%",
          // cursor: "url(./assets/pieces/RW.svg), progress",
          // cursor: "progress",
        }}
      >
        {(() => {
          const jsx = squares.map((sqr) => (
            <Board.Square key={sqr.index} data={sqr} onClick={onSquareClick} />
          ))
          return flip ? jsx.reverse() : jsx
        })()}
      </div>
      <div
        className={`absolute pointer-events-none flex ${
          flip ? "flex-col" : "flex-col-reverse"
        } h-full mx-0.5 text-[.5rem] font-mono text-gray-600 md:text-xs bottom-0`}
      >
        {"abcdefghij".split("").map((_, i) => (
          <b key={i} className="flex-grow">
            {i}
          </b>
        ))}
      </div>
      <div
        className={`absolute pointer-events-none flex ${
          flip ? "flex-row-reverse" : "flex-row"
        } w-full mx-0.5 text-[.5rem] font-mono  text-gray-600 md:text-xs bottom-0`}
      >
        {"abcdefghij".split("").map((ch) => (
          <b key={ch} className="flex-1 pr-1 text-right">
            {ch}
          </b>
        ))}
      </div>
      {/* {selectedPiece && (
        <img
          className="absolute w-6 h-6 pointer-events-none"
          ref={cursorRef}
          src={`./assets/pieces/${selectedPiece}.svg`}
        />
      )} */}
    </div>
  )
}

/* >-------: Square :--------< */
type SquareProp = {
  data: SquareData
  onClick: (index: number, from?: number) => void
}

Board.Square = ({ data, onClick }: SquareProp) => {
  const drag: Record<string, React.DragEventHandler<HTMLButtonElement | HTMLImageElement>> = {
    onStart: (ev) => {
      ev.currentTarget.id = `moving-piece-${data.index}`
      ev.dataTransfer.setData("moving-from", ev.currentTarget.id)
      setTimeout((elem) => (elem.style.visibility = "hidden"), 0, ev.currentTarget)
    },
    onEnter: (ev) => {
      ev.currentTarget.style.backgroundImage =
        "repeating-radial-gradient(#0000, #0000 45%, #0006 45%, #0006 60%)"
    },
    onOver: (ev) => {
      ev.preventDefault()
      ev.dataTransfer.dropEffect = "move"
    },
    onLeave: (ev) => {
      ev.currentTarget.style.backgroundImage = "none"
    },
    onDrop: (ev) => {
      const movingFrom = ev.dataTransfer.getData("moving-from")
      if (!movingFrom) return
      drag.onLeave(ev)
      const sqrIndex = +movingFrom.slice(movingFrom.lastIndexOf("-") + 1)
      if (sqrIndex == data.index) {
        document.getElementById(movingFrom).style.visibility = "visible"
        return
      }
      // console.log("moving", sqrIndex, "->", data.index)
      onClick(data.index, sqrIndex)
    },
  }
  // const row = (data.index / 10) | 0,
  //   col = data.index % 10
  return (
    <button
      className={`relative focus:outline-none ${
        ["bg-red-500", "bg-purple-400", "bg-green-400", "bg-yellow-200"][data.type]
      } bg-opacity-60`}
      onDragEnter={drag.onEnter}
      onDragOver={drag.onOver}
      onDragLeave={drag.onLeave}
      onDrop={drag.onDrop}
      onClick={() => onClick(data.index)}
    >
      {data.piece && (
        <Image
          className="transform scale-90 hover:cursor-[grab] active:cursor-[grabbing]"
          src={`/assets/pieces/${data.piece}.svg`}
          alt={data.piece}
          draggable
          onDragStart={drag.onStart}
          // onDragEnd={onDragEnd}
          layout="fill"
          objectFit="contain"
        />
      )}
      {data.moves && (
        <Icon
          name={data.moves}
          className="absolute w-1/2 text-gray-900 transform -translate-x-1/2 -translate-y-1/2 text-opacity-70 top-1/2 left-1/2"
          outline={data.moves != "circle"}
        />
      )}
    </button>
  )
}
