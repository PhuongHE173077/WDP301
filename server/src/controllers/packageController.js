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
  const userId    = req.jwtDecoded._id;
  const packageId = req.params.id;

  try {
    // 1. Lấy gói và 2 ví
    const [pkg, userWallet, adminWallet] = await Promise.all([
      Package.findById(packageId),
      Wallet.findOne({ userId, status: 'active' }),
      Wallet.findOne({ userId: ADMIN_USER_ID, status: 'active' })
    ]);

    if (!pkg)        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói.');
    if (!userWallet) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy ví người dùng.');
    if (!adminWallet)throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy ví admin.');

    // 2. Kiểm tra số dư
    if (userWallet.balance < pkg.price) {
      return res.status(StatusCodes.PAYMENT_REQUIRED).json({
        message:        'Số dư không đủ',
        currentBalance: userWallet.balance,
        needRecharge:   pkg.price - userWallet.balance
      });
    }

    // 3. Bắt đầu session/transaction
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      /* ---- 3.1 Trừ & cộng tiền ---- */
      userWallet.balance  -= pkg.price;
      adminWallet.balance += pkg.price;
      await Promise.all([
        userWallet.save({ session }),
        adminWallet.save({ session })
      ]);

      /* ---- 3.2 Tạo Transaction ---- */
      await Transaction.create([{
        senderId:   userId,
        receiverId: ADMIN_USER_ID,
        amount:     pkg.price,
        bank:       '-',
        cardType:   '-',
        orderInfo:  packageId,
        txnRef:     uuidv4(),
        description:`Nâng cấp gói ${pkg.name} (${pkg.availableTime} tháng)`,
        status:     'success'
      }], { session });

      /* ---- 3.3 Gia hạn timeExpired ---- */
      const user = await User.findById(userId).session(session);
      const now  = new Date();

      let baseTime = user.timeExpired && user.timeExpired > now
        ? new Date(user.timeExpired)   // còn hạn → cộng tiếp
        : now;                         // hết hạn / chưa có → tính từ hiện tại

      baseTime.setMonth(baseTime.getMonth() + pkg.availableTime);
      user.timeExpired = baseTime;

      await User.findByIdAndUpdate(
  userId,
  { $set: { timeExpired: baseTime } },
  { session }
);

    });

    session.endSession();

    // 4. Phản hồi
    return res.status(StatusCodes.OK).json({
      message:     'Thanh toán gói thành công.',
      newBalance:  userWallet.balance
    });

  } catch (error) {
    next(error);
  }
};

export const packageController = {
    getAllPackages,
    createPackage,
    updatePackage,
    deletePackage,
    buyPackage
}