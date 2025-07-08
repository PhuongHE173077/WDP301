import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from 'vnpay';
import { v4 as uuidv4 } from 'uuid';
import { env } from '~/config/environment';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
const createPayment = async (req, res, next) => {
    try {
        const data = req.body;
        const vnpay = new VNPay({
            tmnCode: env.VNPAY_TMN_CODE,
            secureSecret: env.SECURE_SECRET,
            vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        const vnpayResponse = await vnpay.buildPaymentUrl({
            vnp_Amount: 50000,
            vnp_IpAddr: req.ip,
            vnp_TxnRef: uuidv4(),
            vnp_OrderInfo: data._id,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:8081/api/v1/payment/check-payment-vnpay',
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
export const paymentController = {
    createPayment,
    checkPayment
}