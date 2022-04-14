const { ValidateStatus, SolverStatus } = require('./status')

class SudokuSolver {

  _getRowColumn(index) {
    const row = Math.floor(index / 9)
    const column = index % 9
    
    return { row, column }
  }

  _getIndex(row, column) {
    return (row * 9) + column
  }

  _putAt(puzzleString, index, value) {
    return puzzleString.substring(0, index) + String(value) + puzzleString.substring(index + 1)
  }

  validate(puzzleString) {
    
    if (puzzleString.length !== 81) {
      return ValidateStatus.INVALID81
    } 
    
    for(let i = 0; i < 81; i++) {
      if (puzzleString[i] === '.') continue

      const np = Number(puzzleString[i])
      if (isNaN(np) || np === 0) {
        return ValidateStatus.INVALIDCHARS
      }
    }

    return ValidateStatus.VALID;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = this._getIndex(row, 0)
    const col = this._getIndex(row, column)

    for(let j = rowIndex; j < (rowIndex + 9); j++) {
      if (j !== col && puzzleString[j] === String(value)) {
        return false
      }
    }
    
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colEnd = 81 + (column - 8)
    const rowIndex = this._getIndex(row, column)

    for(let i = column; i < colEnd; i += 9) {
      if (i !== rowIndex && puzzleString[i] === String(value)) {
        return false
      }
    }

    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const base = 3
    const rowRegion = Math.floor(row / base) * base
    const colRegion = Math.floor(column / base) * base

    for(let i = rowRegion; i < (rowRegion + base); i++) {
      for(let j = colRegion; j < (colRegion + base); j++) {
        if (i === row && j === column) continue

        const idx = this._getIndex(i, j)
        if (puzzleString[idx] === String(value)) {
          return false
        }
      }
    }
    
    return true
  }

  solve(puzzleString) {
    
    const res = {
      status: SolverStatus.VALID,
      solution: ''
    }
    const self = this

    function isValid() {
      for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
          const idx = self._getIndex(i, j)
          const value = puzzleString[idx]
         
          if (value !== '.') {
            let ok = self.checkRowPlacement(puzzleString, i, j, value)
            if (!ok) return false
            ok = self.checkColPlacement(puzzleString, i, j, value)
            if (!ok) return false
            ok = self.checkRegionPlacement(puzzleString, i, j, value)
            if (!ok) return false
          }

        }  
      }
      return true
    }

    if (!isValid()) {
      res.status = SolverStatus.INVALID
      return res
    }

    let isEnd = false

    function resolve(index = 0) {
      if (index > 80) {
        isEnd = true
        return
      }

      if (puzzleString[index] === '.') {
        const { row, column } = self._getRowColumn(index)
        for(let num = 1; num <= 9 && !isEnd; num++) {
          let ok = self.checkRowPlacement(puzzleString, row, column, num)
          if (!ok) continue
          ok = self.checkColPlacement(puzzleString, row, column, num)
          if (!ok) continue
          ok = self.checkRegionPlacement(puzzleString, row, column, num)
          if (!ok) continue

          puzzleString = self._putAt(puzzleString, index, num)
          
          resolve(index + 1)

          if (!isEnd) {
            puzzleString = self._putAt(puzzleString, index, '.')
          }
        }
      } else {
        resolve(index + 1)
      }
    }

    resolve()
    res.solution = puzzleString

    return res
  }
}

module.exports = SudokuSolver

