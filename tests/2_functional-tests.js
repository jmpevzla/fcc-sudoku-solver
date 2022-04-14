const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings')

chai.use(chaiHttp);

suite('Functional Tests', () => {

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        const puzzle1 = puzzlesAndSolutions[0][0]
        const solPuzzle1 = puzzlesAndSolutions[0][1]
        const data = {
            puzzle: puzzle1
        }

        chai
        .request(server)
        .post("/api/solve")
        .send(data)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "solution", "response should contain solution");
            assert.equal(res.body.solution, solPuzzle1, `solution should be "${solPuzzle1}"`);
            done();
        });
    });

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        const data = {}
        const error = 'Required field missing'

        chai
        .request(server)
        .post("/api/solve")
        .send(data)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "error", "response should contain error");
            assert.equal(res.body.error, error, `solution should be "${error}"`);
            done();
        });

    });

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        const data = {
            puzzle: '1.5..2.84..63X12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        }
        const error = 'Invalid characters in puzzle'

        chai
        .request(server)
        .post("/api/solve")
        .send(data)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "error", "response should contain error");
            assert.equal(res.body.error, error, `solution should be "${error}"`);
            done();
        });

    });

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        const data = {
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.'
        }
        const error = 'Expected puzzle to be 81 characters long'

        chai
        .request(server)
        .post("/api/solve")
        .send(data)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "error", "response should contain error");
            assert.equal(res.body.error, error, `solution should be "${error}"`);
            done();
        });

    });

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        const data = {
            puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        }
        const error = 'Puzzle cannot be solved'

        chai
        .request(server)
        .post("/api/solve")
        .send(data)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "error", "response should contain error");
            assert.equal(res.body.error, error, `solution should be "${error}"`);
            done();
        });

    });

});

