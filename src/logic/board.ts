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

const getCellIndex = (x: number, y: number, width: number): number => {
   return y * width + x
}

const getNeighborIndexes = (
   index: number,
   width: number,
   height: number,
): number[] => {
   const x = index % width
   const y = Math.floor(index / width)
   const neighbors: number[] = []

   for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
      for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
         if (xOffset === 0 && yOffset === 0) {
            continue
         }

         const neighborX = x + xOffset
         const neighborY = y + yOffset

         const isInsideBoard =
            neighborX >= 0 &&
            neighborX < width &&
            neighborY >= 0 &&
            neighborY < height

         if (!isInsideBoard) {
            continue
         }

         neighbors.push(getCellIndex(neighborX, neighborY, width))
      }
   }

   return neighbors
}

const recalculateAdjacent = (
   cells: Cell[],
   width: number,
   height: number,
): Cell[] => {
   return cells.map((cell, index) => {
      if (cell.mine) {
         return {
            ...cell,
            adjacent: 0,
         }
      }

      const neighbors = getNeighborIndexes(index, width, height)

      return {
         ...cell,
         adjacent: neighbors.filter(
            (neighborIndex) => cells[neighborIndex].mine,
         ).length,
      }
   })
}

const revealCascade = (
   cells: Cell[],
   startIndex: number,
   width: number,
   height: number,
): Cell[] => {
   const updatedCells = cells.map((cell) => ({
      ...cell,
   }))

   const indexesToCheck = [startIndex]

   while (indexesToCheck.length > 0) {
      const currentIndex = indexesToCheck.pop()

      if (currentIndex === undefined) {
         continue
      }

      const currentCell = updatedCells[currentIndex]

      if (currentCell.revealed || currentCell.flagged || currentCell.mine) {
         continue
      }

      currentCell.revealed = true

      if (currentCell.adjacent !== 0) {
         continue
      }

      const neighbors = getNeighborIndexes(
         currentIndex,
         width,
         height,
      )

      for (const neighborIndex of neighbors) {
         const neighbor = updatedCells[neighborIndex]

         if (!neighbor.revealed && !neighbor.flagged && !neighbor.mine) {
            indexesToCheck.push(neighborIndex)
         }
      }
   }

   return updatedCells
}

const hasWon = (cells: Cell[]): boolean => {
   return cells.every((cell) => cell.mine || cell.revealed)
}

const revealNeighbors = (
   cells: Cell[],
   index: number,
   width: number,
   height: number,
): Cell[] => {
   let updatedCells = cells.map((cell) => ({
      ...cell,
   }))

   const neighbors = getNeighborIndexes(index, width, height)

   for (const neighborIndex of neighbors) {
      const neighbor = updatedCells[neighborIndex]

      if (neighbor.flagged || neighbor.revealed) {
         continue
      }

      if (neighbor.mine) {
         neighbor.revealed = true
         continue
      }

      updatedCells = revealCascade(
         updatedCells,
         neighborIndex,
         width,
         height,
      )
   }

   return updatedCells
}

export const createBoard = (level: Level): Board => {
   const cells: Cell[] = Array.from(
      { length: level.width * level.height },
      () => ({
         mine: false,
         revealed: false,
         flagged: false,
         adjacent: 0,
      }),
   )

   const usedMineIndexes = new Set<number>()

   for (const [x, y] of level.mines) {
      const isInsideBoard =
         x >= 0 &&
         x < level.width &&
         y >= 0 &&
         y < level.height

      if (!isInsideBoard) {
         continue
      }

      const index = getCellIndex(x, y, level.width)

      if (usedMineIndexes.has(index)) {
         continue
      }

      usedMineIndexes.add(index)
      cells[index].mine = true
   }

   const cellsWithAdjacent = recalculateAdjacent(
      cells,
      level.width,
      level.height,
   )
   return {
      width: level.width,
      height: level.height,
      cells: cellsWithAdjacent,
      state: 'idle',
   }
}

export const revealCell = (board: Board, index: number): Board => {
   const isOutsideBoard = index < 0 || index >= board.cells.length


   if (
      isOutsideBoard ||
      board.state === 'won' ||
      board.state === 'lost'
   ) {
      return board
   }

   const cell = board.cells[index]

   if (cell.flagged) {
      return board
   }

   if (cell.revealed && cell.adjacent > 0) {
      const neighbors = getNeighborIndexes(
         index,
         board.width,
         board.height,
      )

      const flaggedNeighbors = neighbors.filter(
         (neighborIndex) => board.cells[neighborIndex].flagged,
      )

      if (flaggedNeighbors.length !== cell.adjacent) {
         return board
      }

      const hasWrongFlag = flaggedNeighbors.some(
         (neighborIndex) => !board.cells[neighborIndex].mine,
      )

      if (hasWrongFlag) {
         return {
            ...board,
            state: 'lost',
         }
      }

      const cells = revealNeighbors(
         board.cells,
         index,
         board.width,
         board.height,
      )

      return {
         ...board,
         cells,
         state: hasWon(cells) ? 'won' : 'playing',
      }
   }

   let cells = board.cells.map((currentCell) => ({
      ...currentCell,
   }))

   if (board.state === 'idle' && cells[index].mine) {
      const newMineIndex = cells.findIndex(
         (currentCell, currentIndex) =>
            !currentCell.mine && currentIndex !== index,
      )

      if (newMineIndex !== -1) {
         cells[index].mine = false
         cells[newMineIndex].mine = true

         cells = recalculateAdjacent(
            cells,
            board.width,
            board.height,
         )
      }
   }

   if (cells[index].mine) {
      cells[index].revealed = true

      return {
         ...board,
         cells,
         state: 'lost',
      }
   }

   cells = revealCascade(
      cells,
      index,
      board.width,
      board.height,
   )

   const state = hasWon(cells) ? 'won' : 'playing'

   return {
      ...board,
      cells,
      state,
   }
}

export const toggleFlag = (board: Board, index: number): Board => {
   const isOutsideBoard = index < 0 || index >= board.cells.length

   if (
      isOutsideBoard ||
      board.state === 'won' ||
      board.state === 'lost'
   ) {
      return board
   }

   const cell = board.cells[index]

   if (cell.revealed) {
      return board
   }

   const cells = board.cells.map((currentCell, currentIndex) => {
      if (currentIndex !== index) {
         return currentCell
      }

      return {
         ...currentCell,
         flagged: !currentCell.flagged,
      }
   })

   return {
      ...board,
      cells,
   }
}
