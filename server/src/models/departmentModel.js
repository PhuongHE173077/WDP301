const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    electricPrice: {
      type: Number,
      required: true,
    },
    waterPrice: {
      type: Number,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    commune: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
