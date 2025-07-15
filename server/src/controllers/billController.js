import { StatusCodes } from "http-status-codes";
import Bill from "~/models/billModel";
import OrderRoom from "~/models/orderModel";
import Room from "~/models/roomModel";
import ApiError from "~/utils/ApiError";

const getBills = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id;

        const bills = await Bill.find({ ownerId: userId })
            .populate('ownerId', 'displayName email')
            .populate('tenantId', 'displayName email')
            .populate({
                path: 'roomId',
                select: 'roomId departmentId',
                populate: {
                    path: 'departmentId',
                    select: 'electricPrice waterPrice '
                }
            })
            .sort({ createdAt: -1 });

        res.status(StatusCodes.OK).json(bills);
    } catch (error) {
        next(error)
    }
}

const createBill = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id;
        const room = await Room.findById(req.body.roomId);
        if (!room) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found');
        }
        const orderRoom = await OrderRoom.findOne({
            roomId: req.body.roomId,
            _destroy: false
        });
        const billData = {
            roomId: req.body.roomId,
            tenantId: orderRoom.tenantId[0],
            ownerId: userId,
            price: req.body.price,
            serviceFee: room.serviceFee,
            oldElectricity: orderRoom.oldElectricNumber || 0,
            oldWater: orderRoom.oldWaterNumber || 0,
            time: new Date(req.body.date),

        };

        const bill = await Bill.create(billData);
        res.status(StatusCodes.OK).json(bill);
    } catch (error) {
        next(error);
    }
}

const getBillById = async (req, res, next) => {
    try {
        const billId = req.params.id;
        const userId = req.jwtDecoded._id;

        const bill = await Bill.findById(billId)
            .populate('ownerId', 'displayName email')
            .populate('tenantId', 'displayName email')
            .populate('roomId', 'roomId departmentId');

        if (!bill) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Bill not found');
        }

        res.status(StatusCodes.OK).json(bill);
    } catch (error) {
        next(error);
    }
}
export const billController = {
    getBills,
    createBill,
    getBillById
}