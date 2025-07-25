import express from 'express'
import { billController } from '~/controllers/billController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .get(authMiddlewares.isAuthorized, billController.getBills)
    .post(authMiddlewares.isAuthorized, billController.createBill)

router.route('/tenant')
    .get(authMiddlewares.isAuthorized, billController.getBillsByTenant)

router.route('/:id')
    .get(authMiddlewares.isAuthorized, billController.getBillById)
    .put(authMiddlewares.isAuthorized, billController.updateBill)
    .delete(authMiddlewares.isAuthorized, billController.deleteBill)

router.route('/send-mail')
    .post(authMiddlewares.isAuthorized, billController.sendMail)

export const billRouter = router