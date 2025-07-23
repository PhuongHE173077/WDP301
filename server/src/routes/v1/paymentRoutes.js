import express from 'express'
import { paymentController } from '~/controllers/paymentController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'



const Router = express.Router()

Router.route('/create-qr')
    .post(paymentController.createPayment)

Router.route('/check-payment-vnpay')
    .get(paymentController.checkPayment)

Router.route('/check-payment-contract')
    .get(authMiddlewares.isAuthorized, paymentController.checkPaymentContract)

Router.route('/check-payment-bill')
    .get(authMiddlewares.isAuthorized, paymentController.checkPaymentBill)

Router.route('/check-payment-incidental-cost')
    .get(authMiddlewares.isAuthorized, paymentController.checkPaymentIncidentalCost)

export const paymentRouter = Router