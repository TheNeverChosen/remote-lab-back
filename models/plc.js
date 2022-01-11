const {mongoose} = require('../loaders/mongo');
const {Schema} = mongoose;
const {plcVerSchema} = require('./plcVersion');
const {deviceModels} = require('../utils/env');
const validator = require('validator');

function devSchema(models, msgType){
  return new Schema({
    model:{
      type: String,
      trim: true,
      uppercase: true,
      enum: {
        values: models,
        message: `{VALUE} is not a valid ${msgType} Device Model`
      },
      required: [true, 'Device Model is required']
    },
    port: {
      type: Number,
      min: [0, 'The minimum port number is 0'],
      required: true
    }
  }, {versionKey: false, _id: false});
};

function typeDevSchema(digitalModels, analogModels, ioMsg){
  return new Schema({
    digital:{
      type: [devSchema(digitalModels, `Digital ${ioMsg}`)],
      default: []
    },
    analog:{
      type: [devSchema(analogModels, `Analog ${ioMsg}`)],
      default: []
    }
  }, {versionKey: false, _id: false});
};

const devicesSchema = new Schema({
  input: {
    type: typeDevSchema(deviceModels.input.digital.models, deviceModels.input.analog.models, 'Input'),
    default: ()=>({})
  },
  output: {
    type: typeDevSchema(deviceModels.output.digital.models, deviceModels.output.analog.models, 'Output'),
    default: ()=>({})
  }
}, {versionKey: false, _id: false});

const plcSchema = new Schema({
  name:{
    type: String,
    trim: true,
    maxlength: [72, 'PLC name length cannot be greater than 72 characters'],
    required: [true, 'PLC name is required']
  },
  reference:{
    type: String,
    trim: true,
    unique: true,
    validate:{
      validator: v => validator.isHash(v, 'sha256'),
      message: props => `${props.value} is not a valid PLC reference`
    }
  },
  version:{
    type: plcVerSchema,
    excludeIndexes: true,
    required: [true, 'PLC version description required']
  },
  devices:{
    type: devicesSchema,
    default: ()=>({})
  }
}, {versionKey: false, strictQuery: 'throw'});

module.exports = mongoose.model('plc', plcSchema);