import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { multerUploadMiddlewares } from '~/middlewares/multerUploadMiddlewares'
import { cloudinaryProvider } from '~/providers/CloudinaryProvider'



const Router = express.Router()

Router.route('/upload')
    .post(multerUploadMiddlewares.upload.single('image'), async (req, res, next) => {
        try {
            const imageCoverFile = req.file
            const resultUpload = await cloudinaryProvider.streamUpload(imageCoverFile.buffer, 'images')
            res.status(StatusCodes.OK).json(resultUpload.secure_url)
        } catch (error) {
            next(error)
        }
    }
    )

export const imageRouter = Router