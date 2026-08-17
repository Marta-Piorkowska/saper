import { useState, type MouseEvent } from 'react'
import levelsData from './data/levels.json'
import {
  createBoard,
  revealCell,
  toggleFlag,
  type Level,
} from './logic/board'
import './App.scss'

type LevelsData = {
  levels: Level[]
}

const levels = (levelsData as LevelsData).levels

const App = () => {
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0].id)
  const [board, setBoard] = useState(() => createBoard(levels[0]))

  const selectedLevel = levels.find(
    (level) => level.id === selectedLevelId,
  ) ?? levels[0]

  const handleLevelChange = (levelId: string) => {
    const level = levels.find((item) => item.id === levelId)

    if (!level) {
      return
    }

    setSelectedLevelId(level.id)
    setBoard(createBoard(level))
  }

  const handleRestart = () => {
    setBoard(createBoard(selectedLevel))
  }

  const handleReveal = (index: number) => {
    setBoard((currentBoard) => revealCell(currentBoard, index))
  }

  const handleFlag = (
    event: MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.preventDefault()

    setBoard((currentBoard) => toggleFlag(currentBoard, index))
  }

  const flaggedCount = board.cells.filter((cell) => cell.flagged).length
  const mineCount = board.cells.filter((cell) => cell.mine).length
  const remainingMines = mineCount - flaggedCount

  return (
    <main className="game">
      <h1>Minesweeper</h1>

      <div className="game__controls">
        <label htmlFor="level">Board</label>

        <select
          id="level"
          className="game__select"
          value={selectedLevelId}
          onChange={(event) => handleLevelChange(event.target.value)}
        >
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleRestart}
          className="game__restart"
        >
          Restart
        </button>
      </div>

      <div className="game__status">
        <span>Remaining mines: {remainingMines}</span>

        {board.state === 'won' && (
          <strong>You won!</strong>
        )}

        {board.state === 'lost' && (
          <strong>You lost!</strong>
        )}
      </div>

      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${board.width}, var(--cell-size))`,
        }}
      >
        {board.cells.map((cell, index) => (
          <button
            className={`board__cell ${cell.revealed ? 'board__cell--revealed' : ''
              } ${cell.revealed && !cell.mine && cell.adjacent > 0
                ? `board__cell--number-${cell.adjacent}`
                : ''
              }`}
            key={index}
            type="button"
            onClick={() => handleReveal(index)}
            onContextMenu={(event) => handleFlag(event, index)}
          >
            {cell.flagged
              ? '🚩'
              : board.state === 'lost' && cell.mine
                ? '💣'
                : cell.revealed
                  ? cell.mine
                    ? '💣'
                    : cell.adjacent || ''
                  : ''}
          </button>
        ))}
      </div>
    </main>
  )
}

export default App
