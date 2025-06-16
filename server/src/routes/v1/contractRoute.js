import express from 'express'
import { contractController } from '~/controllers/contractController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { multerUploadMiddlewares } from '~/middlewares/multerUploadMiddlewares'


const router = express.Router()

router.route('/')
    .post(multerUploadMiddlewares.upload.single('file'), contractController.createNew)



export const contractRouter = router
