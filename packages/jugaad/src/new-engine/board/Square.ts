import { Board, Files, Ranks } from '.'
import { Piece } from '../pieces'
import { Alliance } from '../player'
import { ADJACENT_DIRECTION, BOARD_SIZE, ONE_LESS, SQUARE_FLAGS } from '../Utils'

export type SquareName = `${ Files }${ Ranks }`

export abstract class Zone {
  constructor() {
  }
}
export class WarZone extends Zone {
}

class VicinityPieces {
  royals = new Set<Piece>()
  officers = new Set<Piece>()
  soldiers = new Set<Piece>()
}
export class Square {
  static WAR = new WarZone();
  static TRUCE = new WarZone();
  static CASTLE = new WarZone();
  static MEDIATE = new WarZone();
  static FORBIDDEN = new WarZone();
  static Create(board: Board, index: number) {
    const file = index % BOARD_SIZE, rank = index / BOARD_SIZE | 0
    const isEdgeCol = file % ONE_LESS, isEdgeRow = rank % ONE_LESS
    let zone: Zone
    if (isEdgeCol) { // F or T
      zone = isEdgeRow ? Square.FORBIDDEN : Square.TRUCE
    } else { // C or W
      zone = isEdgeRow ? Square.CASTLE : Square.WAR
    }
    const alliance = index < BOARD_SIZE / 2 ? Alliance.WHITE : Alliance.BLACK
    return new Square(board, index, zone, alliance)
  }

  private attackers = new Set<Piece>()
  isExplored: boolean
  vicinity = new Map<Alliance, VicinityPieces>()
    .set(Alliance.WHITE, new VicinityPieces())
    .set(Alliance.BLACK, new VicinityPieces())
  constructor(readonly board: Board, readonly index: number, private readonly zone: Zone, readonly alliance: Alliance) {
    this.isExplored = this.isForbiddenZone
  }
  attack(attacker: Piece) {
    this.attackers.add(attacker)
  }
  isInAttack(attacker?: Piece) {
    return attacker ? this.attackers.has(attacker) : Boolean(this.attackers.size)
  }
  getVicinitySquare(relativeIndex: number) {
    return this.board.getSquareAt(relativeIndex + this.index) ?? null
  }
  getVicinityZone(relativeIndex: number) {
    const vicinitySquare = this.getVicinitySquare(relativeIndex)
    return this.isZoneSame(vicinitySquare) ? vicinitySquare : null
  }
  isZoneSame(square: Square | null) {
    return this.zone === square?.zone
  }
  addVicinityPiece(piece: Piece | null) {
    if (!piece || piece.isNull) return
    const set = this.vicinity.get(piece.alliance)!
    if (piece.isOfficer) {
      set.officers.add(piece)
    } else if (piece.isRoyal) {
      set.royals.add(piece)
    } else if (piece.isSoldier) {
      set.soldiers.add(piece)
    }
  }
  explore(square: Square | null) {
    if (!square || square.isExplored) return
    this.isExplored = true
    for (const relativeIndex of ADJACENT_DIRECTION) {
      const vicinitySquare = square.getVicinitySquare(relativeIndex)
      if (!square.isZoneSame(vicinitySquare) || vicinitySquare.isExplored) continue
      square.explore(vicinitySquare)
    }
  }
  get isEmpty() {
    return this.piece.isNull
  }
  get isOccupied() {
    return !this.isEmpty
  }
  get piece() {
    return this.board.pieces[this.index]
  }
  get name() {
    return SQUARE_FLAGS[this.index] as SquareName
  }

  get isFriendlyRoyalNearby() {
    return Boolean(this.vicinity.get(this.board.activeAlliance).royals.size)
  }
  get isFriendlyOfficerNearby() {
    return Boolean(this.vicinity.get(this.board.activeAlliance).officers.size)
  }
  get isFriendlySoldierNearby() {
    return Boolean(this.vicinity.get(this.board.activeAlliance).soldiers.size)
  }
  get isEnemyRoyalNearby() {
    return Boolean(this.vicinity.get(this.board.inActiveAlliance)!.royals.size)
  }
  get isEnemyOfficerNearby() {
    return Boolean(this.vicinity.get(this.board.inActiveAlliance)!.officers.size)
  }
  get isEnemySoldierNearby() {
    return Boolean(this.vicinity.get(this.board.inActiveAlliance)!.soldiers.size)
  }
  get isGodmanNearby() {
    return Boolean(this.vicinity.get(this.board.activeAlliance).officers.size)
  }

  get isWarZone() {
    return this.zone == Square.WAR
  }
  get isTruceZone() {
    return this.zone == Square.TRUCE
  }
  get isCastle() {
    return this.zone == Square.CASTLE
  }
  get isMediateZone() {
    return this.zone == Square.MEDIATE
  }
  get isForbiddenZone() {
    return this.zone == Square.FORBIDDEN
  }

  get file() {
    return this.name[0] as Files
  }
  get rank() {
    return +this.name[1] as Ranks
  }
}
