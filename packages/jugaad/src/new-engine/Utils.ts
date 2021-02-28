export const BOARD_SIZE = 10
export const ONE_LESS = BOARD_SIZE - 1
export const TOTAL_SQUARES = BOARD_SIZE ** 2

export const _DEFAULT_FEN = '0c1ia1c0/cmhgrsghmc/cppppppppc/9/9/9/9/CPPPPPPPPC/CMHGSRGHMC/0C1AI1C0'
export const DEFAULT_FEN = '.c..ia..c.cmhgrsghmccppppppppc........................................CPPPPPPPPCCMHGSRGHM..C..AI..C.'
export const ORTHOGONAL_DIRECTION = Object.freeze([BOARD_SIZE, 1, -1, -BOARD_SIZE])
export const DIAGNAL_DIRECTION = Object.freeze([BOARD_SIZE - 1, BOARD_SIZE + 1, -BOARD_SIZE - 1, -BOARD_SIZE + 1])

export const ADJACENT_DIRECTION = Object.freeze(DIAGNAL_DIRECTION.concat(ORTHOGONAL_DIRECTION))


export const BOARD_LAYOUT = Array<string>((BOARD_SIZE + 1) ** 2).fill('·')
  .map((val, i) => i % (BOARD_SIZE + 1) ? val : `│\n${ 9 - (i / BOARD_SIZE | 0) } │`)
BOARD_LAYOUT[1] = BOARD_LAYOUT[10] = BOARD_LAYOUT[100] = BOARD_LAYOUT[109] = '#'
const temp = '   ' + '-'.repeat(32)
BOARD_LAYOUT[110] = `│\n${ temp }\n   `
BOARD_LAYOUT[0] = temp + BOARD_LAYOUT[0].slice(1)
for (let i = 111, str = 'xabcdefghy'; i < 121; i++) {
  BOARD_LAYOUT[i] = str[i - 111]
}
export enum SQUARE_FLAGS {
  x9, a9, b9, c9, d9, e9, f9, g9, h9, y9,
  x8, a8, b8, c8, d8, e8, f8, g8, h8, y8,
  x7, a7, b7, c7, d7, e7, f7, g7, h7, y7,
  x6, a6, b6, c6, d6, e6, f6, g6, h6, y6,
  x5, a5, b5, c5, d5, e5, f5, g5, h5, y5,
  x4, a4, b4, c4, d4, e4, f4, g4, h4, y4,
  x3, a3, b3, c3, d3, e3, f3, g3, h3, y3,
  x2, a2, b2, c2, d2, e2, f2, g2, h2, y2,
  x1, a1, b1, c1, d1, e1, f1, g1, h1, y1,
  x0, a0, b0, c0, d0, e0, f0, g0, h0, y0,
}

// type valueof<T> = typeof T[keyof typeof T]

export const SYMBOL = {
  INDRA: 'I', SHASTRI: 'A', CHARAN: 'C', RISHI: 'R',
  SENAPATI: 'S', RATHA: 'M', ASHVA: 'H', GAJA: 'G',
  PYADA: 'P'
} as const
export type PieceSymbol = typeof SYMBOL[keyof typeof SYMBOL]