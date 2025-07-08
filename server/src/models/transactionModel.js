const { orderBy } = require("lodash");
const { default: mongoose } = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    bank: {
        type: String,
        required: true,
    },
    orderInfo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    cardType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    txnRef: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
    },
}, {
    timestamps: true
}
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;