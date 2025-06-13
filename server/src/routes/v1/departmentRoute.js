import express from 'express'
import { createDepartment, deleteDepartment, getDepartmentsByOwner, updateDepartment, getDepartmentById  } from '~/controllers/departmentController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'


const router = express.Router()

router.post('/', authMiddlewares.isAuthorized, createDepartment)
router.get('/owner/:ownerId',authMiddlewares.isAuthorized, getDepartmentsByOwner)
router.put('/:id',authMiddlewares.isAuthorized, updateDepartment)
router.delete('/:id',authMiddlewares.isAuthorized, deleteDepartment)
router.get('/:id',authMiddlewares.isAuthorized, getDepartmentById)
export const departmentRouter = router
