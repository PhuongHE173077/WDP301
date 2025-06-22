import express from 'express'
import { roomController } from '~/controllers/roomController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'


const router = express.Router()

router.route('/')
    .post(authMiddlewares.isAuthorized, roomController.createRoom)


export const roomRouter = router
