import { StatusCodes } from "http-status-codes"
import Wallet from "~/models/walletModel"

const getWallet = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id
        const wallets = await Wallet.findOne({ userId: userId })
        res.status(StatusCodes.OK).json(wallets)
    } catch (error) {
        next(error)
    }
}

export const walletController = {
    getWallet
}