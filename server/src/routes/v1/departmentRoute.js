import express from 'express'
import { departmentController } from '~/controllers/departmentController'
import { createDepartment, deleteDepartment, getDepartmentsByOwner, updateDepartment, getDepartmentById } from '~/controllers/departmentController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'


const router = express.Router()

router.route('/')
    .get(authMiddlewares.isAuthorized, departmentController.getDepartmentsByOwner)
    .post(authMiddlewares.isAuthorized, departmentController.createDepartment)

router.route('/:id')
    .get(authMiddlewares.isAuthorized, departmentController.getDepartmentById)
    .put(authMiddlewares.isAuthorized, departmentController.updateDepartment)
    .delete(authMiddlewares.isAuthorized, departmentController.deleteDepartment)


export const departmentRouter = router
