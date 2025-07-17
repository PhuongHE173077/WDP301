import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { multerUploadMiddlewares } from '~/middlewares/multerUploadMiddlewares'
import { userValidations } from '~/validations/userValidation'



const Router = express.Router()

Router.route('/login')
    .post(userValidations.login, userController.login)

Router.route('/list')
    .get(authMiddlewares.isAuthorized, userController.getAllUser)

Router.route('/logout')
    .delete(userController.logout)

Router.route('/profile')
    .put(authMiddlewares.isAuthorized, multerUploadMiddlewares.upload.single('avatar'), userController.updateProfile)

Router.route('/:id')
    .delete(authMiddlewares.isAdmin,userController.deleteUser)
    .patch(authMiddlewares.isAdmin, userController.restoreUser)

Router.route('/time')
    .get(authMiddlewares.isAuthorized, userController.getTimeExpried)
export const userRouter = Router