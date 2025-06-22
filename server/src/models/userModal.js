import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    dateOfBirth: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        required: true
    },
    verificationExpired: {
        type: Date,
        required: true
    },
    CCCD: {
        type: String,
        default: null
    },
    role: {
        type: String,
        required: true
    },
    timeExpired: {
        type: Date,
        required: true
    },
    _destroy: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema)

export default User