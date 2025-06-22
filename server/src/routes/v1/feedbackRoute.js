import express from 'express'
import { feedbackController } from '~/controllers/feedbackController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'



const Router = express.Router()


Router.route('/')
    .get(authMiddlewares.isAuthorized, feedbackController.getFeedbacksByOwner)

Router.route('/:id/reply')
  .put(authMiddlewares.isAuthorized, feedbackController.replyToFeedback)


export const feedbackRouter = Router