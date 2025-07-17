import express from 'express'
import { packageController } from '~/controllers/packageController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .get(authMiddlewares.isAuthorized, packageController.getAllPackages)
    .post(authMiddlewares.isAdmin, packageController.createPackage)

router.route('/:id')
    .put(authMiddlewares.isAdmin, packageController.updatePackage)
    .delete(authMiddlewares.isAdmin, packageController.deletePackage)
    .post(authMiddlewares.isAuthorized, packageController.buyPackage)

export const packageRouter = router