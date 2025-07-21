import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import { ProductCode, VNPay, VnpLocale, dateFormat, ignoreLogger } from 'vnpay';
import { env } from '~/config/environment';
import Contract from '~/models/contractModel';
import OrderRoom from '~/models/orderModel';
import Transaction from '~/models/transactionModel';
import ApiError from '~/utils/ApiError';
import { WEBSITE_DOMAIN } from '../utils/constants';
import Wallet from '~/models/walletModel';
import Bill from '~/models/billModel';
import dayjs from 'dayjs';
import Room from '~/models/roomModel';
const createPayment = async (req, res, next) => {
    try {
        const data = req.body;
        const { typePayment } = req.query;
        const vnpay = new VNPay({
            tmnCode: env.VNPAY_TMN_CODE,
            secureSecret: env.SECURE_SECRET,
            vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });


        const vnpayResponse = await vnpay.buildPaymentUrl({
            vnp_Amount: data.amount,
            vnp_IpAddr: req.ip,
            vnp_TxnRef: uuidv4(),
            vnp_OrderInfo: data._id,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: typePayment === 'contract' ? 'http://localhost:8081/api/v1/payment/check-payment-contract' :
                typePayment === 'bill' ? 'http://localhost:8081/api/v1/payment/check-payment-bill' :
                    'http://localhost:8081/api/v1/payment/check-payment-vnpay',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(new Date(Date.now() + 15 * 60 * 1000)),
        })
        res.status(StatusCodes.CREATED).json(vnpayResponse);
    } catch (error) {
        next(error);
    }
}

const checkPayment = async (req, res, next) => {
    try {
        console.log('req.query', req.query);

        if (req.query.vnp_ResponseCode !== '00') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment failed');
        }


        res.status(StatusCodes.OK).json({
            message: 'Payment check successful',
            data: req.query,
        });
    } catch (error) {
        next(error);
    }
}

const checkPaymentContract = async (req, res, next) => {
    try {
        const data = req.query;
        const userId = req.jwtDecoded._id;
        const orderRoom = await OrderRoom.findById(data.vnp_OrderInfo).populate('roomId');

        const newTransaction = {
            receiverId: orderRoom.ownerId,
            senderId: userId,
            amount: data.vnp_Amount / 100,
            bank: data.vnp_BankCode,
            orderInfo: data.vnp_OrderInfo,
            cardType: data.vnp_CardType,
            description: `Thanh toán thuê phòng trọ từ ${dayjs(orderRoom.startAt).format('DD/MM/YYYY')} - ${dayjs(orderRoom.endAt).format('DD/MM/YYYY')}`,
            txnRef: data.vnp_TxnRef,
            status: data.vnp_ResponseCode === '00' ? 'success' : 'failed',
        }

        if (req.query.vnp_ResponseCode == '00') {
            await Transaction.create(newTransaction);
            await Contract.findByIdAndUpdate(orderRoom.contract, { paid: true });
            await Room.findByIdAndUpdate(orderRoom.roomId, { status: true });
            await Wallet.findOneAndUpdate({ userId: orderRoom.ownerId }, { $inc: { balance: newTransaction.amount } });
            return res.redirect(`${WEBSITE_DOMAIN}/payment/success`);
        } else {
            return res.redirect(`${WEBSITE_DOMAIN}/payment/error`);
        }

    } catch (error) {
        next(error);
    }
}

const checkPaymentBill = async (req, res, next) => {
    try {
        const data = req.query;
        const userId = req.jwtDecoded._id;
        const bill = await Bill.findById(data.vnp_OrderInfo).populate({
            path: 'roomId',
            populate: {
                path: 'departmentId'
            }
        })

        const newTransaction = {
            receiverId: bill.ownerId,
            senderId: userId,
            amount: data.vnp_Amount / 100,
            bank: data.vnp_BankCode,
            orderInfo: data.vnp_OrderInfo,
            cardType: data.vnp_CardType,
            description: `Thanh toán thuê hóa đơn tháng ${dayjs(bill.time).format('MM/YYYY')} cho phòng ${bill.roomId.roomId} - ${bill.roomId.departmentId.name}`,
            txnRef: data.vnp_TxnRef,
            status: data.vnp_ResponseCode === '00' ? 'success' : 'failed',
        }

        if (req.query.vnp_ResponseCode == '00') {
            await Transaction.create(newTransaction);
            await Bill.findByIdAndUpdate(bill._id, { prepay: data.vnp_Amount / 100, isPaid: true });
            await Wallet.findOneAndUpdate({ userId: bill.ownerId }, { $inc: { balance: newTransaction.amount } });
            return res.redirect(`${WEBSITE_DOMAIN}/payment/success?type=bill`);
        } else {
            return res.redirect(`${WEBSITE_DOMAIN}/payment/error`);
        }

    } catch (error) {
        next(error);
    }
}

export const paymentController = {
    createPayment,
    checkPayment,
    checkPaymentContract,
    checkPaymentBill
}