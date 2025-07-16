const { default: mongoose } = require("mongoose");

const billSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },

    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    oldElectricity: {
        type: Number,
    },
    newElectricity: {
        type: Number,
    },
    oldWater: {
        type: Number,
    },
    newWater: {
        type: Number,
    },
    time: {
        type: Date,
        required: true
    },
    serviceFee: [
        {
            name: {
                type: String,
            },
            price: {
                type: Number,
            }
        }
    ],
    duration: {
        type: Date,
        default: null
    },
    prepay: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
    }
)

const Bill = mongoose.model("Bill", billSchema);
export default Bill