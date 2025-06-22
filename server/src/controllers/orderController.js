import { StatusCodes } from "http-status-codes"
import OrderRoom from "~/models/orderModel"
import { pickUser } from "~/utils/algorithms"
import ApiError from "~/utils/ApiError"

const getOrderByOwnerId = async (req, res, next) => {
    try {
        const owner = req.jwtDecoded._id

        const orders = await OrderRoom.find({ ownerId: owner, _destroy: false }).populate('roomId').populate('tenantId').populate('ownerId').populate('contract')

        const resultData = orders.map((order) => {
            return {
                _id: order._id,
                room: order.roomId,
                tenants: order.tenantId && order.tenantId.length > 0 ? order.tenantId.map(t => pickUser(t)) : null,
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
        const { id } = req.params


        const order = await OrderRoom.findOne({ _id: id, _destroy: false })
        if (!order) return next(new ApiError(StatusCodes.NOT_FOUND, 'Order not found!'))

        const orderUpload = await OrderRoom.findOneAndUpdate({ _id: id }, req.body, { new: true })

        res.status(StatusCodes.OK).json(orderUpload)
    } catch (error) {
        next(error)
    }
}

const getTenantOrder = async (req, res, next) => {
    try {
        const ownerId = req.jwtDecoded._id

        const orders = await OrderRoom.find({ ownerId: ownerId, _destroy: false }).populate('roomId').populate('tenantId')

        console.log(orders);

        // const filterRs = orders.filter((order) => order.tenantId.length > 0)
        const filterRs = orders.filter((order) => Array.isArray(order.tenantId) && order.tenantId.length > 0)
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


const getOrderById = async (req, res, next) => {
    try {
        const ownerId = req.jwtDecoded._id
        const id = req.params.id
        const findBy = req.query.findBy
        let order
        if (!findBy) {
            order = await OrderRoom.findOne({ _id: id, _destroy: false }).populate('roomId').populate('tenantId').populate('ownerId').populate('contract')
            if (order.ownerId._id.toString() !== ownerId) return next(new ApiError(StatusCodes.NOT_FOUND, 'Order not found!'))
        }
        // Tìm theo ContractId
        else if (findBy == 'contract') {
            order = await OrderRoom.findOne({ contract: id, _destroy: false }).populate('roomId').populate('tenantId').populate('ownerId').populate('contract')
        }



        res.status(StatusCodes.OK).json({
            _id: order._id,
            room: order.roomId,
            owner: pickUser(order.ownerId),
            tenants: order.tenantId && order.tenantId?.length > 0 ? order.tenantId.map(t => pickUser(t)) : null,
            contract: order.contract,
            startAt: order.startAt,
            endAt: order.endAt,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        })
    } catch (error) {
        next(error)
    }
}



export const orderController = {
    getOrderByOwnerId,
    updateOrder,
    getTenantOrder,
    updateOrder,
    getOrderById
};