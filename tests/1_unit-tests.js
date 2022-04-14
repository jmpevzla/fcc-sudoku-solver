const mocha = require("mocha");
const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const { ValidateStatus, SolverStatus } = require("../controllers/status.js");
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js")

let solver;

suite("UnitTests", () => {
  suite("Validate Puzzle", () => {
    test("Logic handles a valid puzzle string of 81 characters", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      
      solver = new Solver();
      const val = solver.validate(puzzle);
      assert.equal(
        val,
        ValidateStatus.VALID,
        "validate return should be VALID"
      );
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
      let puzzle =
        "1.5..2.84..63.12.7.2..5.-0..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X";
      solver = new Solver();
      const val = solver.validate(puzzle);
      assert.equal(
        val,
        ValidateStatus.INVALIDCHARS,
        "validate return should be INVALIDCHARS"
      );
    });

    test("Logic handles a puzzle string that is not 81 characters in length", () => {
      let puzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3";
      solver = new Solver();
      const val = solver.validate(puzzle);
      assert.equal(
        val,
        ValidateStatus.INVALID81,
        "validate return should be INVALID81"
      );
    });
  });

  suite("Check Placement", () => {
    let puzzle = puzzlesAndSolutions[0][0]
    solver = new Solver();

    test("Logic handles a valid row placement", () => {
      const check = solver.checkRowPlacement(puzzle, 0, 1, 6);
      assert.isTrue(check, "check return should be true");
    });

    test("Logic handles an invalid row placement", () => {
      const check = solver.checkRowPlacement(puzzle, 0, 1, 2);
      assert.isFalse(check, "check return should be false");
    });

    test("Logic handles a valid column placement", () => {
      const check = solver.checkColPlacement(puzzle, 1, 1, 1);
      assert.isTrue(check, "check return should be true");
    });

    test("Logic handles an invalid column placement", () => {
      const check = solver.checkColPlacement(puzzle, 4, 1, 6);
      assert.isFalse(check, "check return should be false");
    });

    test("Logic handles a valid region (3x3 grid) placement", () => {
      const check = solver.checkRegionPlacement(puzzle, 5, 4, 5);
      assert.isTrue(check, "check return should be true");
    });

    test("Logic handles an invalid region (3x3 grid) placement", () => {
      const check = solver.checkRegionPlacement(puzzle, 3, 8, 7);
      assert.isFalse(check, "check return should be false");
    });
  });

  suite('Solver Puzzle', () => {

    test('Valid puzzle strings pass the solver', () => {
        let puzzle1 = puzzlesAndSolutions[0][0]
        let puzzle2 = puzzlesAndSolutions[1][0]
        let puzzle3 = puzzlesAndSolutions[2][0]
        let puzzle4 = puzzlesAndSolutions[3][0]
        let puzzle5 = puzzlesAndSolutions[4][0]

        solver = new Solver();
        let val = solver.solve(puzzle1);
        assert.equal(val.status, SolverStatus.VALID, 'puzzle1 should be Valid');
        val = solver.solve(puzzle2);
        assert.equal(val.status, SolverStatus.VALID, 'puzzle2 should be Valid');
        val = solver.solve(puzzle3);
        assert.equal(val.status, SolverStatus.VALID, 'puzzle3 should be Valid');
        val = solver.solve(puzzle4);
        assert.equal(val.status, SolverStatus.VALID, 'puzzle4 should be Valid');
        val = solver.solve(puzzle5);
        assert.equal(val.status, SolverStatus.VALID, 'puzzle5 should be Valid');
    });

    test('Invalid puzzle strings fail the solver', () => {
        let puzzle1 = "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        let puzzle2 = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72..33";
        let puzzle3 = "..839.7.585.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1";
        let puzzle4 = ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1.62.9.387.6";
        let puzzle5 = "82..4..6..816..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";

        solver = new Solver();
        let val = solver.solve(puzzle1);
        assert.equal(val.status, SolverStatus.INVALID, 'puzzle1 should be Invalid');
        val = solver.solve(puzzle2);
        assert.equal(val.status, SolverStatus.INVALID, 'puzzle2 should be Invalid');
        val = solver.solve(puzzle3);
        assert.equal(val.status, SolverStatus.INVALID, 'puzzle3 should be Invalid');
        val = solver.solve(puzzle4);
        assert.equal(val.status, SolverStatus.INVALID, 'puzzle4 should be Invalid');
        val = solver.solve(puzzle5);
        assert.equal(val.status, SolverStatus.INVALID, 'puzzle5 should be Invalid');
    });


    test('Solver returns the expected solution for an incomplete puzzle', () => {
        let puzzle1 = puzzlesAndSolutions[0][0]
        let solPuzzle1 = puzzlesAndSolutions[0][1]

        let puzzle2 = puzzlesAndSolutions[1][0]
        let solPuzzle2 = puzzlesAndSolutions[1][1]

        let puzzle3 = puzzlesAndSolutions[2][0]
        let solPuzzle3 = puzzlesAndSolutions[2][1]

        let puzzle4 = puzzlesAndSolutions[3][0]
        let solPuzzle4 = puzzlesAndSolutions[3][1]

        let puzzle5 = puzzlesAndSolutions[4][0]
        let solPuzzle5 = puzzlesAndSolutions[4][1]

        solver = new Solver();
        let val = solver.solve(puzzle1);
        assert.equal(val.solution 
            , solPuzzle1
            , `puzzle1 should be ${solPuzzle1}`);

        val = solver.solve(puzzle2);
        assert.equal(val.solution 
            , solPuzzle2
            , `puzzle2 should be ${solPuzzle2}`);

        val = solver.solve(puzzle3);
        assert.equal(val.solution 
            , solPuzzle3
            , `puzzle3 should be ${solPuzzle3}`);

        val = solver.solve(puzzle4);
        assert.equal(val.solution 
            , solPuzzle4
            , `puzzle4 should be ${solPuzzle4}`);

        val = solver.solve(puzzle5);
        assert.equal(val.solution 
            , solPuzzle5
            , `puzzle5 should be ${solPuzzle5}`);
    });
  })
});
