import express from 'express'
import { orderController } from '~/controllers/orderController'
import { tenantController } from '~/controllers/tenantCotroller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'



const Router = express.Router()

Router.route('/')
    .get(authMiddlewares.isAuthorized, tenantController.getAll)

Router.route('/login')
    .post(tenantController.login)

Router.route('/register')
    .post(tenantController.register)

Router.route('/create-and-assign')
    .post(authMiddlewares.isAuthorized, tenantController.createAndAssign)

export const tenantRouter = Router