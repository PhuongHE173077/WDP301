import express from 'express'
import { orderController } from '~/controllers/orderController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'



const Router = express.Router()


Router.route('/')
    .get(authMiddlewares.isAuthorized, orderController.getOrderByOwnerId)

Router.route("/users")
    .get(authMiddlewares.isAuthorized, orderController.getTenantOrder)

export const orderRouter = Router