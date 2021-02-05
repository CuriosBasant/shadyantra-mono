import Shadyantra from "@shadyantra/core"
import { nanoid } from 'nanoid'

type IShadyantra = ReturnType<typeof Shadyantra.Create>
export default class ShadyantraAPI {
  static GAME_LOOP = new Map<string, IShadyantra>();
  private game: IShadyantra
  constructor(readonly gameId: string, fen: string) {
    console.log(`Game loop mei, ${ ShadyantraAPI.GAME_LOOP.size } games hai!`)
    let game = ShadyantraAPI.GAME_LOOP.get(gameId)
    if (!game) {
      game = Shadyantra.Create(fen)
      this.gameId = nanoid(8)
      ShadyantraAPI.GAME_LOOP.set(this.gameId, game)
    }
    this.game = game
  }

  move(moveStr: object) {
    // @ts-ignore
    this.game.move(moveStr)
  }
  getStatus() {
    return this.game.board
  }
}