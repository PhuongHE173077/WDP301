import express from 'express'
import { billController } from '~/controllers/billController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .get(authMiddlewares.isAuthorized, billController.getBills)
    .post(authMiddlewares.isAuthorized, billController.createBill)



export const billRouter = router