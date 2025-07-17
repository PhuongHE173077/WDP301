import express from 'express'
import { blogController } from '~/controllers/blogController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/:id')
    .post(authMiddlewares.isAuthorized, blogController.addRoomToBlog)
    .delete(authMiddlewares.isAuthorized, blogController.removeRoomFromBlog)
    .get(blogController.getBlogById)

router.route('/check-status/:roomId')
    .get(authMiddlewares.isAuthorized, blogController.checkRoomStatus)
router.route('/')
    .get(blogController.getAllBlog)



export const blogRouter = router