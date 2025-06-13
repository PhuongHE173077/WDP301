import express from 'express'
import { orderController } from '~/controllers/orderController'
import { tenantController } from '~/controllers/tenantCotroller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'



const Router = express.Router()

Router.route('/')
    .get(authMiddlewares.isAuthorized, tenantController.getAll)



export const tenantRouter = Router