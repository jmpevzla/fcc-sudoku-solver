const { ValidateStatus } = require('./status')

class SudokuSolver {

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

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver

