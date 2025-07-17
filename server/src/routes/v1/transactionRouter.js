import express from 'express'
import { getTransactionsByUserId } from '../../controllers/transactionController'

const Router = express.Router()

Router.route('/user/:userId').get(getTransactionsByUserId)

export const transactionRouter = Router