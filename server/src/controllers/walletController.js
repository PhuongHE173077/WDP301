import { StatusCodes } from "http-status-codes"
import Wallet from "~/models/walletModel"
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

const getWallet = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id
        const wallets = await Wallet.findOne({ userId: userId })
        res.status(StatusCodes.OK).json(wallets)
    } catch (error) {
        next(error)
    }
}

const getWalletByAdmin = async (req, res) => {
  try {
    const adminId = ADMIN_USER_ID;

    // Lấy số dư ví
    const wallet = await Wallet.findOne({ userId: adminId, status: "active" });

    res.status(200).json({
      walletBalance: wallet?.balance || 0
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy giao dịch hoặc số dư ví của admin",
      error: error.message
    });
  }
};

export const walletController = {
    getWallet,
    getWalletByAdmin
}