import { StatusCodes } from "http-status-codes"
import Blog from "~/models/blogModel"
import BookRoom from "~/models/bookRoomMode"
import OrderRoom from "~/models/orderModel"
import ApiError from "~/utils/ApiError"
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
        console.log("🚀 ~ getBookRoom ~ isRole:", isRole)

        let bookRoom
        if (isRole === USER_ROLES.TENANT) {
            bookRoom = await BookRoom.find({ tenantId: userId }).populate("roomId").populate("blogId").sort({ createdAt: -1 })
        } else if (isRole === 'owner') {
            bookRoom = await BookRoom.find({})
                .populate({
                    path: 'roomId',
                    populate: {
                        path: 'departmentId',
                        match: { ownerId: userId }
                    }
                })
                .populate('blogId')
                .populate('tenantId')
                .sort({ createdAt: -1 })
        }


        res.status(StatusCodes.OK).json(bookRoom)
    } catch (error) {
        next(error)
    }
}

const updateBookRoom = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newData = req.body;

        // Validate the incoming data
        if (!id) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, 'BookRoom ID is required'));
        }

        // Find the book room
        const bookRoom = await BookRoom.findById(id);
        if (!bookRoom) {
            return next(new ApiError(StatusCodes.NOT_FOUND, 'BookRoom not found'));
        }

        // Find the associated order room
        const orderRoom = await OrderRoom.findOne({ roomId: bookRoom.roomId });
        if (!orderRoom) {
            return next(new ApiError(StatusCodes.NOT_FOUND, 'OrderRoom not found'));
        }




        // Handle different status cases
        switch (newData.status) {
            case 'reject':
                await BookRoom.findByIdAndUpdate(id, newData, { new: true });
                break;

            case 'approve':
                // Validate required fields for approval
                if (!bookRoom.tenantId) {
                    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Tenant ID is required for approval'));
                }

                await BookRoom.findByIdAndUpdate(id, newData, { new: true });
                const currentTenants = orderRoom.tenantId || [];

                const dataUpdate = {
                    tenantId: [...currentTenants, bookRoom.tenantId],
                    startAt: bookRoom.startDate,
                    endAt: bookRoom.endDate
                };

                const updatedOrderRoom = await OrderRoom.findByIdAndUpdate(orderRoom._id, dataUpdate, { new: true });
                res.status(StatusCodes.OK).json(updatedOrderRoom._id);
                break;

            default:
                // For any other status, just update the book room
                await BookRoom.findByIdAndUpdate(id, newData, { new: true });
        }

        // Return the updated book room
        const updatedBookRoom = await BookRoom.findById(id);
        res.status(StatusCodes.OK).json(updatedBookRoom);

    } catch (error) {
        next(error);
    }
};

export const bookRoomController = {
    createBookRoom,
    getBookRoom,
    updateBookRoom
}