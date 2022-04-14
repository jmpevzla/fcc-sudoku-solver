'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const { ValidateStatus, SolverStatus } = require('../controllers/status')

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

    });
    
  app.route('/api/solve')
    .post((req, res) => {

      const { puzzle } = req.body;
      
      if (typeof(puzzle) === 'undefined') {
        return res.json({ error: 'Required field missing' })
      }

      const validate = solver.validate(puzzle)
      if (ValidateStatus.INVALIDCHARS === validate) {
        return res.json({ error: 'Invalid characters in puzzle' })
      }
      if (ValidateStatus.INVALID81 === validate) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }

      const sol = solver.solve(puzzle);

      if (SolverStatus.INVALID === sol.status) {
        return res.json({ error: 'Puzzle cannot be solved' })
      }

      res.json(sol);

    });
};
