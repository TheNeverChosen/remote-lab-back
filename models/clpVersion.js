const {mongoose} = require('../loaders/mongo');
const {Schema} = mongoose;

const ioSchema = new Schema({
  digital:{
    type: Number,
    min: [0, 'The minimum number of digital inputs is 0'],
    default: 0
  },
  analog:{
    type: Number,
    min: [0, 'The minimum number of analog inputs is 0'],
    default: 0
  }
}, {_id: false});

const clpVerDesc = {
  name:{
    type: String,
    trim: true,
    unique: true,
    maxlength: [72, 'CLP version name length cannot be greater than 72 characters'],
    required: [true, 'CLP version name is required']
  },
  input:{
    type: ioSchema,
    default: ()=>({})
  },
  output:{
    type: ioSchema,
    required: true,
    default: ()=>({})
  },
  createdAt:{
    type: Date,
    required: [true, 'CLP version creation date is required']
  }
};

const clpVerSchema = new Schema(clpVerDesc, {versionKey: false, strictQuery: 'throw'});

module.exports = {
  ClpVersion: mongoose.model('clp_version', clpVerSchema),
  clpVerDesc
};