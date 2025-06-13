import Contract from "./contractModel";
import Room from "./roomModel";
import Tenant from "./tenantModel";
import User from "./userModal";

const { types } = require("joi");
const { default: mongoose, Schema } = require("mongoose");

const orderSchema = new mongoose.Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    tenantId: [{
        type: Schema.Types.ObjectId,
        ref: "Tenant",
        required: true
    }],
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    contract: {
        type: Schema.Types.ObjectId,
        ref: "Contract",
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
const OrderRoom = mongoose.model('OrderRoom', orderSchema, "orderRooms")

export default OrderRoom