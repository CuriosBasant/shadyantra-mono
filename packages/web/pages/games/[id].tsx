import firebase from "firebase"
import { GetStaticPaths, GetStaticProps } from 'next'
import { BoardContainer } from '../../components'
import { BoardProvider } from '../../providers'
import { database } from '../../firebase'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let data = {} as any
  try {
    const doc: firebase.firestore.DocumentSnapshot = await database.boards.doc(params.id as string).get()
    if (!doc.exists) return
    data = doc.data()
  } catch (error) {
    console.log(error.message)
  }
  // const gameAPI = new ShadyantraAPI(params.id as string, data.fen)
  // const boardStatus = { ...gameAPI.getStatus().board, gameId: params.id }
  // console.log(boardStatus)
  return {
    props: { fen: data.fen ?? null, gameId: params.id }
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export default function SingleBoard(props) {
  return (
    <BoardContainer { ...props } />
    // <BoardProvider {...props}>
    // </BoardProvider>
  )
}
