const chai = require('chai');
const assert = chai.assert;

const Solver  = require('../controllers/sudoku-solver.js');
const { ValidateStatus } = require('../controllers/status.js');

let solver;

suite('UnitTests', () => {

    suite('Validate Puzzle', () => {
        test('Logic handles a valid puzzle string of 81 characters', () => {
            let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'  
            solver = new Solver()
            const val = solver.validate(puzzle)
            assert.equal(val, ValidateStatus.VALID, 'validate return should be VALID')
        })

        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
            let puzzle = '1.5..2.84..63.12.7.2..5.-0..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X'
            solver = new Solver()
            const val = solver.validate(puzzle)
            assert.equal(val, ValidateStatus.INVALIDCHARS, 'validate return should be INVALIDCHARS')
        })

        test('Logic handles a puzzle string that is not 81 characters in length', () => {
            let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3'
            solver = new Solver()
            const val = solver.validate(puzzle)
            assert.equal(val, ValidateStatus.INVALID81, 'validate return should be INVALID81')
        })
    })

    suite('Check Placement', () => {
        
    })
});
