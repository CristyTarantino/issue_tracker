/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

let issueId;

suite("Functional Tests", function() {
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end(function(err, res) {
          issueId = res.body._id;
          console.log(issueId);
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          done();
        });
    });

    test("Required fields filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });

    test("Missing required fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.error.text, "missing inputs");
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => text", function() {
    test("No id", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.error.text, "no id provided");
          done();
        });
    });

    test("No body", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({ _id: issueId })
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.error.text, "no updated field sent");
          done();
        });
    });

    test("Invalid id", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({ _id: "thisisaninvalidid", issue_text: "issue_text changed" })
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.error.text, "could not update thisisaninvalidid");
          done();
        });
    });

    test("One field to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: issueId,
          issue_text: "issue_text changed"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated");
          done();
        });
    });

    test("Multiple fields to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: issueId,
          issue_title: "issue_title changed",
          issue_text: "issue_text changed again",
          open: 'false'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated");
          done();
        });
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function() {
      test("No filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("One filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test?open=false")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body.length > 0, true);
            assert.equal(res.body.every(issue => issue.open === false), true);
            done();
          });
      });

      test("Multiple filters", function(done) {
        chai
          .request(server)
          .get(
            "/api/issues/test?open=true&created_by=Functional%20Test%20-%20Every%20field%20filled%20in"
          )
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body.every(issue => issue.open === true), true);
            assert.equal(
              res.body.every(
                issue =>
                  issue.created_by === "Functional Test - Every field filled in"
              ),
              true
            );
            done();
          });
      });
    }
  );

  suite("DELETE /api/issues/{project} => text", function() {
    test("Valid _id", function(done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({ _id: issueId })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, `deleted ${issueId}`);
          done();
        });
    });
    
    test("No _id", function(done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.text, "_id error");
          done();
        });
    });

    test("Invalid _id", function(done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({ _id: "thisisaninvalidid" })
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.text, "could not delete thisisaninvalidid");
          done();
        });
    });
  });
});
