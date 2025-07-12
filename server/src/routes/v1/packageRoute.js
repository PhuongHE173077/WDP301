import express from 'express'
import { packageController } from '~/controllers/packageController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .get(authMiddlewares.isAdmin, packageController.getAllPackages)
    .post(authMiddlewares.isAdmin, packageController.createPackage)

router.route('/:id')
    .put(authMiddlewares.isAdmin, packageController.updatePackage)
    .delete(authMiddlewares.isAdmin, packageController.deletePackage)


export const packageRouter = router