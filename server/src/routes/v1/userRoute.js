import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidations } from '~/validations/userValidation'



const Router = express.Router()

Router.route('/login')
    .post(userValidations.login, userController.login)

export const userRouter = Router