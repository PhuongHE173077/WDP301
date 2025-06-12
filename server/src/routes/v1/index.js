import express from 'express'
import { userRouter } from './userRoute'
import { departmentRouter } from './departmentRoute'



const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'Api v1 is ready' })
})

//user APIs
Router.use('/', userRouter)
//department APIs
Router.use('/', departmentRouter)

export const APIs_V1 = Router