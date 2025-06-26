import { StatusCodes } from "http-status-codes"
import Blog from "~/models/blogModel"
import BookRoom from "~/models/bookRoomMode"

export const createBookRoom = async (req, res, next) => {
    try {
        const tenantId = req.jwtDecoded._id

        const CurrentBlog = await Blog.findById(req.body.blogId)

        const newData = {
            ...req.body,
            tenantId: tenantId,
            roomId: CurrentBlog.roomId
        }
        const bookRoom = await BookRoom.create(newData)
        res.status(StatusCodes.OK).json(bookRoom)
    } catch (error) {
        next(error)
    }
}

export const bookRoomController = {
    createBookRoom
}