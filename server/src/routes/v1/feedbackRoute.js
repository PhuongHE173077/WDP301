import express from 'express'
import { feedbackController } from '~/controllers/feedbackController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'



const Router = express.Router()


Router.route('/')
  .get(authMiddlewares.isAuthorized, feedbackController.getFeedbacksByOwner)
  .post(authMiddlewares.isAuthorized, feedbackController.createFeedback);

Router.route('/:id/reply')
  .put(authMiddlewares.isAuthorized, feedbackController.replyToFeedback)

Router.route('/me/owners')
  .get(authMiddlewares.isAuthorized, feedbackController.getMyOwners)

Router.route('/myfeedbacks')
  .get(authMiddlewares.isAuthorized, feedbackController.getMyFeedbacks)

export const feedbackRouter = Router