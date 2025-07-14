const mongoose = require("mongoose");
const { default: User } = require("./userModal");
const { default: OrderRoom } = require("./orderModel");
const { Schema } = mongoose;

const transactionSchema = new Schema(
    {
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User", // hoặc model tương ứng với user
            required: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User", // hoặc model tương ứng với user
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        bank: {
            type: String,
            required: true,
        },
        orderInfo: {
            type: Schema.Types.ObjectId,
            ref: "OrderRoom", // hoặc model tương ứng với đơn hàng
            required: true,
        },
        cardType: {
            type: String,
            enum: ["ATM", "Credit", "Visa", "MasterCard"], // tùy chỉnh thêm nếu cần
            required: true,
        },
        description: {
            type: String,
        },
        txnRef: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            required: true,
            default: "pending",
        },
    },
    {
        timestamps: true, // tự động tạo createdAt và updatedAt
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction
