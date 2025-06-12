const { types } = require("joi");
const { default: mongoose, Schema } = require("mongoose");

const orderSchema = new mongoose.Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    tenantId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    contractId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    startAt: {
        type: Date,
        required: true
    },
    endAt: {
        type: Date,
        required: true
    },
    oldElectricNumber: {
        type: Number,
        required: true
    },
    history: {
        type: Array,
    },
    _destroy: {
        type: Boolean,
        default: false
    }
})
const Order = mongoose.model('Order', orderSchema)

export default Order
