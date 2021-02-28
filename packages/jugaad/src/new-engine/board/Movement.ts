import { Square } from './Square'

export abstract class Move {
  constructor(readonly originSquare: Square, readonly destinationSquare: Square) {

  }
}
export class NormalMove extends Move {

}
export class AttackMove extends Move {

}