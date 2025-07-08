import express from 'express'
import { paymentController } from '~/controllers/paymentController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'



const Router = express.Router()

Router.route('/create-qr')
    .post(paymentController.createPayment)

Router.route('/check-payment-vnpay')
    .get(paymentController.checkPayment)


export const paymentRouter = Router