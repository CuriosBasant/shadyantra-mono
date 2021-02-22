import { useEffect } from 'react'
import { useImmerReducer } from 'use-immer'

const enum ACTIONS { SQUARE_CLICK, t }

const initialState = {
  gameId: ''
}

function reducer(state: typeof initialState, { type, payload }: { type: ACTIONS; payload: any }) {
  switch (type) {
    case ACTIONS.SQUARE_CLICK: return
  }
  return state
}

export function useBoard(gameId: string) {
  const [state, dispatch] = useImmerReducer(reducer, { ...initialState, gameId })

  useEffect(() => {

  }, [])

  return [state, dispatch]
}
