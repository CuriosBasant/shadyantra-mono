import React from "react"
import { BoardEditor } from "../../components/shadyantra"
import { BoardProvider } from "../../providers/BoardProvider"

export default function BoardEditorPage() {
  return (
    <BoardProvider>
      <BoardEditor isOffline />
    </BoardProvider>
  )
}
