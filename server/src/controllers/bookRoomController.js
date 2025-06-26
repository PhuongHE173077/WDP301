import { StatusCodes } from "http-status-codes"
import Blog from "~/models/blogModel"
import BookRoom from "~/models/bookRoomMode"
import { USER_ROLES } from "~/utils/constants"

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

export const getBookRoom = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id

        const isRole = req.query.isRole

        let bookRoom
        if (isRole === USER_ROLES.TENANT) {
            bookRoom = await BookRoom.find({ tenantId: userId }).populate("roomId").populate("blogId").sort({ createdAt: -1 })
        }


        res.status(StatusCodes.OK).json(bookRoom)
    } catch (error) {
        next(error)
    }
}

export const bookRoomController = {
    createBookRoom,
    getBookRoom
}