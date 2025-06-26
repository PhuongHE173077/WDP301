import { StatusCodes } from "http-status-codes"
import BookRoom from "~/models/bookRoomMode"

export const createBookRoom = async (req, res, next) => {
    try {
        const tenantId = req.jwtDecoded._id

        const newData = {
            ...req.body,
            tenantId: tenantId
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