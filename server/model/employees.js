const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  place: String
});
mongoose.model('Employees', employeeSchema);