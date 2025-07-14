import express from 'express'
import { walletController } from '~/controllers/walletController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'



const Router = express.Router()

Router.route('/')
    .get(authMiddlewares.isAuthorized, walletController.getWallet)

export const walletRouter = Router