import express from 'express'
import { contractController } from '~/controllers/contractController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { multerUploadMiddlewares } from '~/middlewares/multerUploadMiddlewares'


const router = express.Router()

router.route('/')
    .get(authMiddlewares.isAuthorized, contractController.getContractsByTenantId)
    .post(multerUploadMiddlewares.upload.single('file'), contractController.createNew)

router.route('/:id')
    .put(multerUploadMiddlewares.upload.single('file'), contractController.updateContract)
export const contractRouter = router
