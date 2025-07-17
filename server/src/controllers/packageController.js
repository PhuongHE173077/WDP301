import mongoose from 'mongoose';
import Package from '~/models/packageModel.js';
import Wallet from '~/models/walletModel.js';
import Transaction from '~/models/transactionModel.js';
import ApiError from '~/utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import User from '~/models/userModal';
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;
// Tạo gói mới
const createPackage = async (req, res) => {
    try {
        const { name, description, price, availableTime } = req.body;

        const newPackage = await Package.create({ name, description, price, availableTime });
        return res.status(201).json(newPackage);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách gói
const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find({ _destroy: false }).sort({ availableTime: 1 });
        return res.json(packages);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cập nhật gói
const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, availableTime } = req.body;

        const updated = await Package.findByIdAndUpdate(
            id,
            { name, description, price, availableTime },
            { new: true }
        );
        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xoá gói
const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;
        await Package.findByIdAndUpdate(id, { _destroy: true });
        return res.json({ message: 'Xoá gói thành công' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const buyPackage = async (req, res, next) => {
  const userId = req.jwtDecoded._id;
  const packageId = req.params.id;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 1. Lấy gói, ví user, ví admin
      const pkg = await Package.findById(packageId).session(session);
      if (!pkg) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói.');

      const [userWallet, adminWallet] = await Promise.all([
        Wallet.findOne({ userId, status: 'active' }).session(session),
        Wallet.findOne({ userId: ADMIN_USER_ID, status: 'active' }).session(session)
      ]);
      if (!userWallet)  throw new ApiError(404, 'Không tìm thấy ví người dùng.');
      if (!adminWallet) throw new ApiError(404, 'Không tìm thấy ví admin.');

      // 2. Trừ tiền an toàn
      const updatedUserWallet = await Wallet.findOneAndUpdate(
        { _id: userWallet._id, balance: { $gte: pkg.price } },
        { $inc: { balance: -pkg.price } },
        { new: true, session }
      );
      if (!updatedUserWallet) {
        throw new ApiError(StatusCodes.PAYMENT_REQUIRED, 'Số dư không đủ hoặc lỗi khi cập nhật.');
      }

      // 3. Cộng tiền vào ví admin
      await Wallet.updateOne(
        { _id: adminWallet._id },
        { $inc: { balance: pkg.price } },
        { session }
      );

      // 4. Tạo giao dịch
      await Transaction.create([{
        senderId:   userId,
        receiverId: ADMIN_USER_ID,
        amount:     pkg.price,
        txnRef:     uuidv4(), 
        orderInfo:  packageId,
        description:`Nâng cấp gói ${pkg.name}`,
        status:     'success',
        bank: '-',
        cardType: '-'
      }], { session });

      // 5. Cập nhật thời gian hết hạn
      const user = await User.findById(userId).session(session);
      const now  = new Date();
      const baseTime = user.timeExpired && user.timeExpired > now
        ? new Date(user.timeExpired)
        : now;

      baseTime.setMonth(baseTime.getMonth() + pkg.availableTime);

      await User.findByIdAndUpdate(
        userId,
        { $set: { timeExpired: baseTime } },
        { session }
      );
    });

    return res.status(StatusCodes.OK).json({
      message: 'Thanh toán gói thành công!'
    });

  } catch (error) {  
    next(error);
  }finally {
  await session.endSession();  
}
};

export const packageController = {
    getAllPackages,
    createPackage,
    updatePackage,
    deletePackage,
    buyPackage
}