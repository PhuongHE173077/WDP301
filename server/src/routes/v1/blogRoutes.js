import express from 'express'
import { blogController } from '~/controllers/blogController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/:id')
    .post(authMiddlewares.isAuthorized, blogController.addRoomToBlog)
    .get(blogController.getBlogById)

router.route('/')
    .get(blogController.getAllBlog)



export const blogRouter = router