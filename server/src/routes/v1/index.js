import express from 'express'
import { userRouter } from './userRoute'
import { orderRouter } from './orderRouter'
import { departmentRouter } from './departmentRoute'
import { tenantRouter } from './tenantRouter'
import { roomRouter } from './roomRoute'



const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'Api v1 is ready' })
})

//user APIs
Router.use('/', userRouter)

//Order Room APIs
Router.use('/orders', orderRouter)

//department APIs
Router.use('/departments', departmentRouter)

//tenant APIs
Router.use('/tenants', tenantRouter)

//room APIs
Router.use('/rooms', roomRouter)

export const APIs_V1 = Router