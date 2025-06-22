const mongoose = require('mongoose');
const { default: User } = require('./userModal');

const tenantSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true
        },
        displayName: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        address: {
            type: String,
            trim: true,
            default: ''
        },
        avatar: {
            type: String,
            trim: true,
            default: ''
        },
        dateOfBirth: {
            type: String,
            trim: true,
            default: ''
        },
        CCCD: {
            type: String,
            trim: true,
            default: ''
        },
        _destroy: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant