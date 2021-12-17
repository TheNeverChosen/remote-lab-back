const mongoose = require('../mongo');
const {Schema} = mongoose;

const userSchema = new Schema({
  name: String,
  username:{
    type: String,
    unique: true,
    required: true
  },
  email:{
    type: String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  role:{ //0->Master, 1->Admin, 2->Student
    type: Number,
    min: 0,
    max: 2,
    required: true
  },
  createdAt:{
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('user', userSchema);