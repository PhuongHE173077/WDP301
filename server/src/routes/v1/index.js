import express from 'express'



const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'Api v1 is ready' })
})

//user APIs


export const APIs_V1 = Router