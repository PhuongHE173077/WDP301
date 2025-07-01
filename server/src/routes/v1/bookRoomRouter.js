import express from 'express'
import { bookRoomController } from '~/controllers/bookRoomController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .post(authMiddlewares.isAuthorized, bookRoomController.createBookRoom)




export const bookRoomRouter = router