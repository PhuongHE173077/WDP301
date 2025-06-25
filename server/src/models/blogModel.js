import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  availableFrom: {
    type: Date
  },
  description: {
    type: String,
    default: ''
  }
});

const Blog = mongoose.model('Blog', blogSchema, 'blogs');
export default Blog;
