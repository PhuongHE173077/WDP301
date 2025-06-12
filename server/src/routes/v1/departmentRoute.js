import express from 'express'
import { createDepartment, deleteDepartment, getDepartmentsByOwner, updateDepartment } from '~/controllers/departmentController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'


const router = express.Router()

router.post('/departments', authMiddlewares.isAuthorized, createDepartment)
router.get('/departments/:ownerId',authMiddlewares.isAuthorized, getDepartmentsByOwner)
router.put('/departments/:id',authMiddlewares.isAuthorized, updateDepartment)
router.delete('/departments/:id',authMiddlewares.isAuthorized, deleteDepartment)
export const departmentRouter = router
