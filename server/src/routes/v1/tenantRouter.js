import express from 'express'
import { orderController } from '~/controllers/orderController'
import { tenantController } from '~/controllers/tenantCotroller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { multerUploadMiddlewares } from '~/middlewares/multerUploadMiddlewares'



const Router = express.Router()

Router.route('/')
    .get(authMiddlewares.isAuthorized, tenantController.getAll)

Router.route('/login')
    .post(tenantController.login)

Router.route('/register')
    .post(tenantController.register)

Router.route('/profile')
    .put(authMiddlewares.isAuthorized, multerUploadMiddlewares.upload.single('avatar'), tenantController.updateProfile)



export const tenantRouter = Router