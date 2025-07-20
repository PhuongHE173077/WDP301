const Transaction = require("~/models/transactionModel");
import User from "~/models/userModal"


const ADMIN_USER_ID = process.env.ADMIN_USER_ID;
// Lấy tất cả giao dịch của một người dùng theo receiverId hoặc senderId
exports.getTransactionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const transactions = await Transaction.find({
            $or: [
                { receiverId: userId },
                { senderId: userId }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy giao dịch', error: err.message });
    }
};

//Lấy tất cả giao dịch của admin

const getTransactionByAdmin = async (req, res) => {
    try {
        const adminId = ADMIN_USER_ID;

        const adminTransactions = await Transaction.find({
                 receiverId: adminId 
          
        })
        .populate("receiverId", "displayName email")
        .populate("senderId", "displayName email")
        .sort({ createdAt: -1 });

        res.status(200).json(adminTransactions);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy giao dịch của admin", error: error.message });
    }
};
export const transactionController = {
    getTransactionByAdmin
}