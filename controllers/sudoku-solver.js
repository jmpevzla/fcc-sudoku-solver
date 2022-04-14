const { ValidateStatus } = require('./status')

class SudokuSolver {

  // _getRowColumn(index) {
  //   const row = Math.floor(index / 9)
  //   const column = index % 9
    
  //   return { row, column }
  // }

  _getIndex(row, column) {
    return (row * 9) + column
  }

  _createMatrix(puzzleString) {
    const matrix = []

    for(let i = 0; i < 9; i++) {
      const vector = []
      matrix.push(vector)
      
      for(let j = 0; j < 9; j++) {
        const index = this._getIndex(i, j)
        vector.push(puzzleString[index])
      }
    }

    return matrix
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
    const matrix = this._createMatrix(puzzleString)

    for(let j = 0; j < 9; j++) {
      if (j !== column && matrix[row][j] === String(value)) {
        return false
      }
    }
    
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    const matrix = this._createMatrix(puzzleString)

    for(let i = 0; i < 9; i++) {
      if (i !== row && matrix[i][column] === String(value)) {
        return false
      }
    }
    
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const matrix = this._createMatrix(puzzleString)

    const base = 3
    const rowRegion = Math.floor(row / base) * base
    const colRegion = Math.floor(column / base) * base

    for(let i = rowRegion; i < (rowRegion + base); i++) {
      for(let j = colRegion; j < (colRegion + base); j++) {
        if (i === row && j === column) continue

        if (matrix[i][j] === String(value)) {
          return false
        }
      }
    }
    
    return true
  }

  solve(puzzleString) {
    const matrix = this._createMatrix(puzzleString)

    
  }
}

module.exports = SudokuSolver

