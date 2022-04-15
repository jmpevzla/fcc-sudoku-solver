"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");
const { ValidateStatus, SolverStatus } = require("../controllers/status");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (typeof(puzzle) === 'undefined'
      || typeof(coordinate) === 'undefined'
      || typeof(value) === 'undefined') {
      return res.json({ error: 'Required field(s) missing' });
    }

    const val = solver.validate(puzzle)

    if (ValidateStatus.INVALIDCHARS === val) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    if (ValidateStatus.INVALID81 === val) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }

    const conflict = [];

    const codeA = 'A'.charCodeAt(0);
    const codeI = 'I'.charCodeAt(0);
    const codeCoordRow = coordinate.charCodeAt(0);
    const row = codeCoordRow - codeA;
    const col = Number(coordinate.substring(1)) - 1

    if (codeCoordRow < codeA 
      || codeCoordRow > codeI
      || isNaN(col)
      || col < 0
      || col > 8) {
      return res.json({ error: 'Invalid coordinate' })
    }
    
    const valueNum = Number(value)

    if (isNaN(valueNum)
     || valueNum < 1
     || valueNum > 9) {
      return res.json({ error: 'Invalid value' })
    }

    let ok = solver.checkRowPlacement(puzzle, row, col, value);
    if (!ok) conflict.push("row");
    ok = solver.checkColPlacement(puzzle, row, col, value);
    if (!ok) conflict.push("column");
    ok = solver.checkRegionPlacement(puzzle, row, col, value);
    if (!ok) conflict.push("region");

    if (conflict.length > 0) {
      return res.json({
        valid: false,
        conflict,
      });
    }

    res.json({
      valid: true,
    });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (typeof puzzle === "undefined") {
      return res.json({ error: "Required field missing" });
    }

    const validate = solver.validate(puzzle);
    if (ValidateStatus.INVALIDCHARS === validate) {
      return res.json({ error: "Invalid characters in puzzle" });
    }
    if (ValidateStatus.INVALID81 === validate) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    const sol = solver.solve(puzzle);

    if (SolverStatus.INVALID === sol.status) {
      return res.json({ error: "Puzzle cannot be solved" });
    }

    res.json(sol);
  });
};
