import { describe, expect, it } from 'vitest'
import {
   createBoard,
   revealCell,
   toggleFlag,
   type Level
} from './board'

describe('toggleFlag', () => {
   it('adds and removes a flag from a hidden cell', () => {
      const level: Level = {
         id: 'test',
         name: 'Test',
         width: 2,
         height: 2,
         mineCount: 1,
         mines: [[0, 0]],
      }

      const board = createBoard(level)

      const flaggedBoard = toggleFlag(board, 0)

      expect(flaggedBoard.cells[0].flagged).toBe(true)

      const unflaggedBoard = toggleFlag(flaggedBoard, 0)

      expect(unflaggedBoard.cells[0].flagged).toBe(false)
   })
})

describe('revealCell', () => {
   it('moves a mine when the first revealed cell contains one', () => {
      const level: Level = {
         id: 'test',
         name: 'Test',
         width: 3,
         height: 1,
         mineCount: 1,
         mines: [[0, 0]],
      }

      const board = createBoard(level)
      const revealedBoard = revealCell(board, 0)

      expect(revealedBoard.cells[0].mine).toBe(false)
      expect(revealedBoard.cells[0].revealed).toBe(true)
      expect(revealedBoard.cells[1].mine).toBe(true)
      expect(revealedBoard.state).not.toBe('lost')
   })
})

it('reveals connected empty cells in a cascade', () => {
   const level: Level = {
      id: 'test',
      name: 'Test',
      width: 3,
      height: 3,
      mineCount: 1,
      mines: [[2, 2]],
   }

   const board = createBoard(level)
   const revealedBoard = revealCell(board, 0)

   expect(revealedBoard.cells[0].revealed).toBe(true)
   expect(revealedBoard.cells[1].revealed).toBe(true)
   expect(revealedBoard.cells[3].revealed).toBe(true)
})

it('sets board state to won when all safe cells are revealed', () => {
   const level: Level = {
      id: 'test',
      name: 'Test',
      width: 2,
      height: 1,
      mineCount: 1,
      mines: [[1, 0]],
   }

   const board = createBoard(level)
   const revealedBoard = revealCell(board, 0)

   expect(revealedBoard.cells[0].revealed).toBe(true)
   expect(revealedBoard.state).toBe('won')
})

it('loses when the first mine cannot be moved', () => {
   const level: Level = {
      id: 'test',
      name: 'Test',
      width: 2,
      height: 1,
      mineCount: 2,
      mines: [
         [0, 0],
         [1, 0],
      ],
   }

   const board = createBoard(level)
   const revealedBoard = revealCell(board, 0)

   expect(revealedBoard.cells[0].mine).toBe(true)
   expect(revealedBoard.cells[0].revealed).toBe(true)
   expect(revealedBoard.state).toBe('lost')
})

it('loses when chording with an incorrectly placed flag', () => {
   const level: Level = {
      id: 'test',
      name: 'Test',
      width: 3,
      height: 2,
      mineCount: 1,
      mines: [[2, 0]],
   }

   let board = createBoard(level)

   board = revealCell(board, 1)
   board = toggleFlag(board, 0)

   const chordedBoard = revealCell(board, 1)

   expect(chordedBoard.state).toBe('lost')
})

describe('createBoard', () => {
   it('ignores duplicate mines and mines outside the board', () => {
      const level: Level = {
         id: 'test',
         name: 'Test',
         width: 3,
         height: 3,
         mineCount: 4,
         mines: [
            [0, 0],
            [0, 0],
            [2, 2],
            [3, 1],
         ],
      }

      const board = createBoard(level)

      const mines = board.cells.filter((cell) => cell.mine)

      expect(mines).toHaveLength(2)
      expect(board.cells[0].mine).toBe(true)
      expect(board.cells[8].mine).toBe(true)
   })
})
