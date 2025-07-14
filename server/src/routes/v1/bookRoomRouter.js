import express, { Router } from 'express'
import { bookRoomController } from '~/controllers/bookRoomController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .post(authMiddlewares.isAuthorized, bookRoomController.createBookRoom)
    .get(authMiddlewares.isAuthorized, bookRoomController.getBookRoom)

router.route('/:id')
    .put(authMiddlewares.isAuthorized, bookRoomController.updateBookRoom)




export const bookRoomRouter = router