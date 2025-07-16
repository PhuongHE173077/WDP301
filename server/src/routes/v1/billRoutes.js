import express from 'express'
import { billController } from '~/controllers/billController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .get(authMiddlewares.isAuthorized, billController.getBills)
    .post(authMiddlewares.isAuthorized, billController.createBill)

router.route('/:id')
    .get(authMiddlewares.isAuthorized, billController.getBillById)
    .put(authMiddlewares.isAuthorized, billController.updateBill)
    .delete(authMiddlewares.isAuthorized, billController.deleteBill)

export const billRouter = router