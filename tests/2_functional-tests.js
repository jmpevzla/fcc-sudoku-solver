const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("Solve", () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
      const puzzle1 = puzzlesAndSolutions[0][0];
      const solPuzzle1 = puzzlesAndSolutions[0][1];
      const data = {
        puzzle: puzzle1,
      };

      chai
        .request(server)
        .post("/api/solve")
        .send(data)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "solution",
            "response should contain solution"
          );
          assert.equal(
            res.body.solution,
            solPuzzle1,
            `solution should be "${solPuzzle1}"`
          );
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
      const data = {};
      const error = "Required field missing";

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

    test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
      const data = {
        puzzle:
          "1.5..2.84..63X12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      };
      const error = "Invalid characters in puzzle";

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

    test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
      const data = {
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.",
      };
      const error = "Expected puzzle to be 81 characters long";

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

    test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
      const data = {
        puzzle:
          "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      };
      const error = "Puzzle cannot be solved";

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

  suite("Check", () => {
    test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
      const data = {
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "B2",
        value: 8,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(data)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "valid", "response should contain valid");
          assert.isTrue(res.body.valid, `valid should be "True"`);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
      const data = {
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "E4",
        value: 4,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(data)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "valid", "response should contain valid");
          assert.property(
            res.body,
            "conflict",
            "response should contain conflict"
          );

          assert.isFalse(res.body.valid, `valid should be "False"`);
          assert.isArray(res.body.conflict, "conflict should be a Array");
          assert.include(
            res.body.conflict.join(" "),
            "row",
            'conflict should have "row"'
          );
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflict: POST request to /api/check", (done) => {
      const data = {
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "B2",
        value: 7,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(data)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "valid", "response should contain valid");
          assert.property(
            res.body,
            "conflict",
            "response should contain conflict"
          );

          assert.isFalse(res.body.valid, `valid should be "False"`);
          assert.isArray(res.body.conflict, "conflict should be a Array");
          const conflict = res.body.conflict.join(" ");
          assert.include(conflict, "row", 'conflict should have "row"');
          assert.include(conflict, "column", 'conflict should have "column"');
          done();
        });
    });

    test("Check a puzzle placement with all placement conflict: POST request to /api/check", (done) => {
      const data = {
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "I8",
        value: 9,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(data)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(res.body, "valid", "response should contain valid");
          assert.property(
            res.body,
            "conflict",
            "response should contain conflict"
          );

          assert.isFalse(res.body.valid, `valid should be "False"`);
          assert.isArray(res.body.conflict, "conflict should be a Array");
          const conflict = res.body.conflict.join(" ");
          assert.include(conflict, "row", 'conflict should have "row"');
          assert.include(conflict, "column", 'conflict should have "column"');
          assert.include(conflict, "region", 'conflict should have "region"');
          done();
        });
    });

    test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
        const data = {
          puzzle: puzzlesAndSolutions[0][0]
        };
  
        const error = "Required field(s) missing";
    
        chai
        .request(server)
        .post("/api/check")
        .send(data)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "error", "response should contain error");
            assert.equal(res.body.error, error, `solution should be "${error}"`);
            done();
        });
    });

    test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
        const data = {
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1..P.8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'B2',
            value: 4
        };
        const error = "Invalid characters in puzzle";
    
        chai
        .request(server)
        .post("/api/check")
        .send(data)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "error", "response should contain error");
            assert.equal(res.body.error, error, `solution should be "${error}"`);
            done();
        });
    });

    test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
        const data = {
            puzzle: '1...5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'B2',
            value: 4
        };
        const error = "Expected puzzle to be 81 characters long";
    
        chai
        .request(server)
        .post("/api/check")
        .send(data)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "error", "response should contain error");
            assert.equal(res.body.error, error, `solution should be "${error}"`);
            done();
        });
    });
    
    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
        const data = {
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'C12',
            value: 4
        };
        const error = "Invalid coordinate";
    
        chai
        .request(server)
        .post("/api/check")
        .send(data)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "error", "response should contain error");
            assert.equal(res.body.error, error, `solution should be "${error}"`);
            done();
        });
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", done => {

        const data = {
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'C2',
            value: 'X'
        };
        const error = "Invalid value";
    
        chai
        .request(server)
        .post("/api/check")
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
});
