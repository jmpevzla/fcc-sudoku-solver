const mocha = require("mocha");
const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const { ValidateStatus } = require("../controllers/status.js");

let solver;

suite("UnitTests", () => {
  suite("Validate Puzzle", () => {
    test("Logic handles a valid puzzle string of 81 characters", () => {
      let puzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
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
    let puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
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
        let puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        solver = new Solver();

        
    });

    test('Invalid puzzle strings fail the solver', () => {

    });
  })
});
