/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
// Import our Controllers
const issueController = require("../controllers/issueController.js");

module.exports = app => {
  app
    .route("/api/issues/:project")

    .get((req, res) => {    
      issueController
        .getIssuesByProject(req.params, req.query)
        .then(issues => res.status(200).json(issues))
        .catch(e => res.status(400).send(e));
    })

    .post((req, res) => {
      const projectName = req.params.project;

      issueController
        .addIssue(projectName, req.body)
        .then(issue => res.status(200).json(issue))
        .catch(e => res.status(400).send(e));
    })

    .put((req, res) => {
      
      issueController
        .updateIssue(req.body)
        .then(message => res.status(200).send(message))
        .catch(e => res.status(400).send(e));
    })

    .delete((req, res) => {
      issueController
        .deleteIssue(req.body)
        .then(message => res.status(200).send(message))
        .catch(e => res.status(400).send(e));
    });
  
  app.route('/:project')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });
};
