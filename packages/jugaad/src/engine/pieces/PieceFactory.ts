import { Arthshastri, Ashvarohi, Gajarohi, Guptchar, Maharathi, Piece, Pyada, Rajendra, Rajrishi, Senapati } from '.'
import { Alliance } from '../player'

const Type = {
  P: Pyada,
  C: Guptchar,
  G: Gajarohi,
  H: Ashvarohi,
  M: Maharathi,
  S: Senapati,
  A: Arthshastri,
  I: Rajendra,
  J: Rajendra,
  R: Rajrishi,
}
export type PieceSymbol = keyof typeof Type
export type PieceNotation = Lowercase<PieceSymbol> | PieceSymbol
const PieceFactory = {
  Type,
  Create(notation: string, position: number): Piece {
    const Type = this.Type[notation.toUpperCase() as PieceSymbol]
    if (!Type) throw new Error("Invalid Piece Notation")

    const alliance = notation == notation.toUpperCase() ? Alliance.WHITE : Alliance.BLACK
    return new Type(position, alliance)
  }
}
export default PieceFactory
