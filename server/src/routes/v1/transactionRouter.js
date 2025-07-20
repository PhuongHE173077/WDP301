import express from 'express'
import { getTransactionsByUserId, transactionController } from '../../controllers/transactionController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const Router = express.Router()

Router.route('/user/:userId').get(getTransactionsByUserId)

Router.route('/admin')
    .get(authMiddlewares.isAdmin, transactionController.getTransactionByAdmin)
export const transactionRouter = Router