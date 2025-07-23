import express from 'express'
import { incidentalCostsController } from '~/controllers/IncidentalCostController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const Router = express.Router()

Router.route('/')
    .get(authMiddlewares.isAuthorized, incidentalCostsController.getAllIncidentalCosts)
    .post(authMiddlewares.isAuthorized, incidentalCostsController.createIncidentalCost)

Router.route('/:id')
    .delete(authMiddlewares.isAuthorized, incidentalCostsController.deleteIncidentalCost)
    .put(authMiddlewares.isAuthorized, incidentalCostsController.updateIncidentalCost)

Router.route('/tenant')
    .get(authMiddlewares.isAuthorized, incidentalCostsController.getAllIncidentalCostsByTenant)

export const incidentalCostsRouter = Router