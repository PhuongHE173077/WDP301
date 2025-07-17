const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },                
  description: { type: [String], default: "" },
  price: { type: Number, required: true },               
  availableTime: { type: Number, required: true },   
  _destroy: { type: Boolean, default: false }    
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);
export default Package;