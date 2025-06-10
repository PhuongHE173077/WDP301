import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { userValidations } from '~/validations/userValidation'



const Router = express.Router()

Router.route('/login')
    .post(userValidations.login, userController.login)

Router.route('/list')
    .get(authMiddlewares.isAuthorized, userController.getAllUser)

export const userRouter = Router