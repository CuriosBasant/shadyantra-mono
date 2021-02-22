import { GetServerSideProps } from 'next'
import { database } from '../../firebase'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

const DEFAULT_FEN = '.c..ir..c.cmhgasghmccppppppppc........................................CPPPPPPPPCCMHGSAGHMC.C..RI..C.'

/* 
export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const games = await database.boards.get()
  games.forEach((doc) => {
    console.log(doc.id, '=>', doc.data())
  })
  // console.log(games.docs)
  return {
    props: {
      games: games.docs.map(doc => doc.data())
    }
  }
} */

export default function Games({ games }) {
  const router = useRouter()

  const handleCreateNewGame = useCallback(async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const gameId = nanoid(8)
    // await database.boards.doc(gameId).set({ fen: DEFAULT_FEN, moves: [] })
    router.push(`/games/${ gameId }`)
    console.log('game created')
  }, [])
  const handlePlayingOffline = useCallback(async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const gameId = nanoid(8)
    // await database.boards.doc(gameId).set({ fen: DEFAULT_FEN, moves: [] })
    router.push("/games/offline")
    console.log('game created')
  }, [])
  return <main>
    <h1>game page</h1>
    <button onClick={ handleCreateNewGame }>Create New Game</button>
    <button onClick={ handlePlayingOffline }>Play Offline</button>
    {/* { games.map(game => <li key={ game.gameId }>{ game.gameId }</li>) } */ }
  </main>
}

