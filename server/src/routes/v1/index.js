import express from 'express'
import { userRouter } from './userRoute'
import { orderRouter } from './orderRouter'
import { departmentRouter } from './departmentRoute'
import { tenantRouter } from './tenantRouter'
import { feedbackRouter } from './feedbackRoute'
import { contractRouter } from './contractRoute'
import { imageRouter } from './imageRoute'
import { roomRouter } from './roomRoute'
import { blogRouter } from './blogRoutes'
import { bookRoomRouter } from './bookRoomRouter'
import { transactionRouter } from './transactionRouter'
import { walletRouter } from './WalletRouter'
import { paymentRouter } from './paymentRoutes'
import { billRouter } from './billRoutes'
import { packageRouter } from './packageRoute'



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

//feedback APIs
Router.use('/feedbacks', feedbackRouter)

//contract APIs
Router.use('/contracts', contractRouter)

//image APIs
Router.use('/images', imageRouter)

//room APIs
Router.use('/rooms', roomRouter)

//blog APIs
Router.use('/blogs', blogRouter)

//book room APIs
Router.use('/book-rooms', bookRoomRouter)

//Transaction APIs
Router.use('/transaction', transactionRouter)
//wallet APIs
Router.use('/wallet', walletRouter)

//payment APIs
Router.use('/payment', paymentRouter)

//bill APIs
Router.use('/bills', billRouter)

//package APIs
Router.use('/packages', packageRouter)
export const APIs_V1 = Router