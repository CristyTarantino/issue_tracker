// Get Data Models
const Issue = require("../models/Issue");
const Project = require("../models/Project");
const mongoose = require("mongoose");

exports.getIssuesByProject = async ({ project }, reqQuery) => {
  try {
    const projectData = await Project.findOne({ name: project });
    const issues = await Issue.find({
      project_id: projectData._id,
      ...reqQuery
    });

    return issues;
  } catch (err) {
    throw err;
  }
};

// Add a new issue
exports.addIssue = async (
  projectName,
  { issue_title, issue_text, created_by, assigned_to = "", status_text = "" }
) => {
  if (
    !issue_title &&
    issue_title !== "" &&
    !issue_text &&
    issue_text !== "" &&
    !created_by &&
    created_by !== ""
  ) {
    throw "missing inputs";
  }

  try {
    const project = await Project.findOneAndUpdate(
      { name: projectName },
      {
        $setOnInsert: {
          name: projectName
        }
      },
      //Insert object if not found, Return new object after modify
      { upsert: true, new: true, useFindAndModify: false }
    );

    const issue = await Issue.create({
      project_id: project.id,
      issue_title,
      issue_text,
      created_by,
      assigned_to,
      status_text,
      created_on: new Date(),
      updated_on: new Date(),
      open: true
    });

    return issue;
  } catch (err) {
    throw err;
  }
};

// Update an existing car
exports.updateIssue = async req => {
  const [a, ...rest] = Object.keys(req);
  const updateObj = rest.reduce((acc, prop) => {
    if (req[prop] && req[prop] !== "") {
      acc[prop] = req[prop];
    }
    return acc;
  }, {});
  
  const id = req._id;

  if (id && id !== "") {
    if (Object.keys(updateObj).length <= 0) {
      throw "no updated field sent";
    }

    try {
      const update = await Issue.findByIdAndUpdate(
        id,
        { ...updateObj, updated_on: new Date() },
        { useFindAndModify: false }
      );
      
      return "successfully updated";
    } catch (err) {
      throw "could not update " + id;
    }
  } else {
    throw "no id provided";
  }
};

// Delete a car
exports.deleteIssue = async ({ _id }) => {
  if (_id && _id !== "") {
    try {
      const update = await Issue.findByIdAndRemove(_id, {
        useFindAndModify: false
      });

      return `deleted ${_id}`;
    } catch (err) {
      throw `could not delete ${_id}`;
    }
  } else {
    throw "_id error";
  }
};
