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
  title: {
    type: String,
    required: true
  },
  availableFrom: {
    type: Date
  },
  description: {
    type: String,
    default: ''
  },
  _destroy: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema, 'blogs');
export default Blog;
