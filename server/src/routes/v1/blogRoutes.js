import express from 'express'
import { blogController } from '~/controllers/blogController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/:id')
    .post(authMiddlewares.isAuthorized, blogController.addRoomToBlog)




export const blogRouter = router