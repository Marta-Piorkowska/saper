export type Level = {
   id: string
   name: string
   width: number
   height: number
   mineCount: number
   mines: [number, number][]
}

export type Cell = {
   mine: boolean
   revealed: boolean
   flagged: boolean
   adjacent: number
}

export type Board = {
   width: number
   height: number
   cells: Cell[]
   state: 'idle' | 'playing' | 'won' | 'lost'
}

export function createBoard(level: Level): Board {
   throw new Error('Not implemented')
}

export function revealCell(board: Board, index: number): Board {
   throw new Error('Not implemented')
}

export function toggleFlag(board: Board, index: number): Board {
   throw new Error('Not implemented')
}
