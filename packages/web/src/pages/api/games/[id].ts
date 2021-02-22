import { NextApiRequest, NextApiResponse } from 'next'
import firebase from "firebase"
import ShadyantraAPI from '../../../ShadyantraAPI'
import { database } from '../../../firebase'

export default async function (request: NextApiRequest, response: NextApiResponse) {
  console.log(request.query.id, '-----------', request.body, request.env)
  const doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> = await database.boards.doc(request.query.id as string).get()
  if (!doc.exists) return response.end()
  const data = doc.data()
  const gameAPI = new ShadyantraAPI(request.query.id as string, data.fen)
  gameAPI.move(request.body.data)
  const boardStatus = gameAPI.getStatus()
  // request.query
  response.json(boardStatus)
}