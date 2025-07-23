import express from 'express'
import { orderController } from '~/controllers/orderController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const Router = express.Router()

Router.route('/')
    .get(authMiddlewares.isAuthorized, orderController.getOrderByOwnerId)

Router.route("/tenant")
    .get(authMiddlewares.isAuthorized, orderController.getTenantOrder)

Router.route("/:id")
    .get(authMiddlewares.isAuthorized, orderController.getOrderById)
    .put(authMiddlewares.isAuthorized, orderController.updateOrder)
    .delete(authMiddlewares.isAuthorized, orderController.deleteOrder)

Router.route("/tenant/my-rooms")
    .get(authMiddlewares.isAuthorized, orderController.getOrdersOfTenant);

export const orderRouter = Router