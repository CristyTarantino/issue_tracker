// External Dependancies
const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('Projects', projectSchema);