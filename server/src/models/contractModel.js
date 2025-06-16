import Room from './roomModel';
const mongoose = require('mongoose');
const { default: OrderRoom } = require('./orderModel');
const { default: User } = require('./userModal');
const { Schema } = mongoose;

const contractSchema = new Schema({
    tenantId: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }],
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    roomId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Room"
    },
    content: {
        type: String,
        required: true
    },
    signature_A: {
        type: String,
        default: ''
    },
    signature_B: {
        type: String,
        default: ''
    },
    contractURI: {
        type: String,
        required: true
    },
    deposit: {
        type: Number,
        required: true

    }
    , image1CCCD: {
        type: String,
        default: ''
    },
    image2CCCD: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending_signature', 'pending_review', 'approved', 'rejected'],
        default: 'pending_signature'
    },
    reason: {
        type: String,
        default: ''
    },
    userSignedAt: {
        type: Date,
        default: null
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
