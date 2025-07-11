const { default: mongoose } = require("mongoose");

const walletSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active"
    }
}, {
    timestamps: true
});

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet