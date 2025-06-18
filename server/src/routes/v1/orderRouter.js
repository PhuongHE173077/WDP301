import express from 'express'
import { orderController } from '~/controllers/orderController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'



const Router = express.Router()


Router.route('/')
    .get(authMiddlewares.isAuthorized, orderController.getOrderByOwnerId)

Router.route("/tenant")
    .get(authMiddlewares.isAuthorized, orderController.getTenantOrder)

export const orderRouter = Router