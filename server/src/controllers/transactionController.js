const Transaction = require("~/models/transactionModel");


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
