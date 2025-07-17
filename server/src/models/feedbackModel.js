const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant", 
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String], 
    default: [],
  },
  status: {
    type: String,
    enum: ["Pending", "Replied"],
    default: "Pending",
  },
  reply: {
    type: String,
    default: "",
  },
}, {
  timestamps: true, 
});

const Feedback = mongoose.model("Feedback", feedbackSchema, "feedback");

export default Feedback