import { StatusCodes } from "http-status-codes"
import Contract from "~/models/contractModel"
import OrderRoom from "~/models/orderModel"
import Room from "~/models/roomModel"
import Tenant from "~/models/tenantModel"
import { pickUser } from "~/utils/algorithms"
import ApiError from "~/utils/ApiError"

const getOrderByOwnerId = async (req, res, next) => {
    try {
        const owner = req.jwtDecoded._id

        const orders = await OrderRoom.find({ ownerId: owner }).populate('roomId').populate('tenantId').populate('ownerId').populate('contract')

        const resultData = orders.filter((order) => order.roomId?._destroy === false).map((order) => {
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
        const contractList = await Contract.find({})
        const tenantList = await Tenant.find({})
        if (!findBy) {
            order = await OrderRoom.findOne({ _id: id, _destroy: false })
                .populate({
                    path: 'roomId',
                    populate: {
                        path: 'departmentId',
                        model: 'Department'
                    }
                })
                .populate('tenantId')
                .populate('ownerId')
                .populate('contract');

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
            history: order.history.map(h => ({
                tenant: tenantList.find(t => t._id.toString() === h.tenantId.toString()),
                contract: contractList.find(c => c._id.toString() === h.contract.toString()),
                startAt: h.startAt,
                endAt: h.endAt,
                createdAt: h.createdAt,
                updatedAt: h.updatedAt,
            })),
            startAt: order.startAt,
            endAt: order.endAt,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        })
    } catch (error) {
        next(error)
    }
}
const getOrdersOfTenant = async (req, res, next) => {
    try {
        const tenantId = req.jwtDecoded._id;

        // Tìm các đơn thuê có tenant hiện tại và populate roomId & contract
        const orders = await OrderRoom.find({
            tenantId: tenantId,
            _destroy: false
        })
            .populate("roomId")
            .populate("contract"); // cần để kiểm tra contract.paid

        const paidOrders = orders.filter(order => {
            return order.contract && order.contract.paid === true && order.roomId;
        });

        const roomData = paidOrders.map(order => {
            const room = order.roomId;
            return {
                _id: room._id,
                roomId: room.roomId,
                image: room.image,
                price: room.price,
                area: room.area,
                utilities: room.utilities,
                serviceFee: room.serviceFee
            };
        });

        res.status(StatusCodes.OK).json(roomData);
    } catch (error) {
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const { isSave } = req.query
        const ownerId = req.jwtDecoded._id

        const order = await OrderRoom.findOne({ _id: id, _destroy: false })
        if (!order) return next(new ApiError(StatusCodes.NOT_FOUND, 'Order not found!'))

        if (order.ownerId.toString() !== ownerId) return next(new ApiError(StatusCodes.NOT_FOUND, 'Order not found!'))

        if (isSave) {
            const today = new Date();
            const orderEndAt = new Date(order.endAt);

            const newHistory = {
                tenantId: order.tenantId,
                contract: order.contract,
                startAt: order.startAt,
                endAt: today > orderEndAt ? order.endAt : today,
            };

            const orderDelete = await OrderRoom.findOneAndUpdate(
                { _id: id },
                {
                    tenantId: [],
                    contract: null,
                    startAt: null,
                    endAt: null,
                    history: [...order.history, newHistory],
                },
                { new: true }
            );
            await Room.findOneAndUpdate({ _id: order.roomId }, { status: false });

            res.status(StatusCodes.OK).json(orderDelete);
        }


        const orderDelete = await OrderRoom.findOneAndUpdate({ _id: id }, {
            tenantId: [],
            contract: null,
            startAt: null,
            endAt: null,
        }, { new: true })
        await Room.findOneAndUpdate({ _id: order.roomId }, { status: false });

        res.status(StatusCodes.OK).json(orderDelete)
    } catch (error) {
        next(error)
    }
}


export const orderController = {
    getOrderByOwnerId,
    updateOrder,
    getTenantOrder,
    updateOrder,
    getOrderById,
    getOrdersOfTenant,
    deleteOrder
};