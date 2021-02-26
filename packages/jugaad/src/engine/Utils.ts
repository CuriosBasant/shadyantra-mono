export const BOARD_SIZE = 10
export const TOTAL_SQUARES = BOARD_SIZE ** 2

export const _DEFAULT_FEN = '0c1ia1c0/cmhgrsghmc/cppppppppc/9/9/9/9/CPPPPPPPPC/CMHGSRGHMC/0C1AI1C0'
export const DEFAULT_FEN = '.c..ia..c.cmhgrsghmccppppppppc........................................CPPPPPPPPCCMHGSRGHMC.C..AI..C.'
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