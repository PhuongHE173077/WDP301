import { StatusCodes } from "http-status-codes"
import OrderRoom from "~/models/orderModel"
import { pickUser } from "~/utils/algorithms"

const getOrderByOwnerId = async (req, res, next) => {
    try {
        const owner = req.jwtDecoded._id

        const orders = await OrderRoom.find({ ownerId: owner, _destroy: false }).populate('roomId').populate('tenantId').populate('ownerId').populate('contract')

        const resultData = orders.map((order) => {
            return {
                _id: order._id,
                room: order.roomId,
                tenant: pickUser(order.tenantId),
                contract: order.contract,
                startAt: order.startAt,
                endAt: order.endAt,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            }
        })
        res.status(StatusCodes.OK).json(resultData)
    } catch (error) {
        next(error)
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params


        const order = await OrderRoom.findOne({ _id: orderId, _destroy: false })
        if (!order) return next(new ApiError(StatusCodes.NOT_FOUND, 'Order not found!'))

        const orderUpload = await OrderRoom.findOneAndUpdate({ _id: orderId }, req.body, { new: true })

        res.status(StatusCodes.OK).json(orderUpload)
    } catch (error) {
        next(error)
    }
}

const getTenantOrder = async (req, res, next) => {
    try {
        const ownerId = req.jwtDecoded._id

        const orders = await OrderRoom.find({ tenantId: ownerId, _destroy: false }).populate('roomId').populate('tenantId')

        console.log(orders);
        
        const filterRs = orders.filter((order) => order.tenantId.length > 0)
        const uniqueTenantIds = [
            ...new Set(
                filterRs.flatMap(item => item.tenantId.map(t => t))
            )
        ].map(item => pickUser(item));


        res.status(StatusCodes.OK).json(uniqueTenantIds)
    } catch (error) {
        next(error)
    }
}



export const orderController = {
    getOrderByOwnerId,
    updateOrder,
    getTenantOrder
};