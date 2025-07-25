import { StatusCodes } from "http-status-codes";
import Bill from "~/models/billModel";
import OrderRoom from "~/models/orderModel";
import Room from "~/models/roomModel";
import { sendEmail } from "~/providers/MailProvider";
import ApiError from "~/utils/ApiError";
import { generateElectricBillHTML } from "~/utils/form-html";

const getBills = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id;

        const bills = await Bill.find({ ownerId: userId })
            .populate('ownerId', 'displayName email phone')
            .populate('tenantId', 'displayName email phone')
            .populate({
                path: 'roomId',
                select: 'roomId departmentId price',
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
            price: room.price,
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
            .populate('tenantId', 'displayName email phone')
            .populate('roomId', 'roomId departmentId price');

        if (!bill) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Bill not found');
        }

        res.status(StatusCodes.OK).json(bill);
    } catch (error) {
        next(error);
    }
}

const updateBill = async (req, res, next) => {
    try {
        const billId = req.params.id;
        const userId = req.jwtDecoded._id;

        const bill = await Bill.findById(billId);
        if (!bill) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Bill not found');
        }

        const dataUpdate = {
            price: req.body.price,
            oldElectricity: req.body.oldElectricity,
            newElectricity: req.body.newElectricity,
            oldWater: req.body.oldWater,
            newWater: req.body.newWater,
            prepay: req.body.prepay,
            duration: new Date(req.body.deadline),
            total: req.body.total,
            status: true
        }
        if (dataUpdate.prepay === dataUpdate.total) {
            dataUpdate.isPaid = true;

        }

        await OrderRoom.findOneAndUpdate({ roomId: bill.roomId }, { oldElectricNumber: dataUpdate.newElectricity, oldWaterNumber: dataUpdate.newWater });

        const updatedBill = await Bill.findByIdAndUpdate(billId, dataUpdate, { new: true });
        res.status(StatusCodes.OK).json(updatedBill);
    } catch (error) {
        next(error);
    }
}

const deleteBill = async (req, res, next) => {
    try {
        const billId = req.params.id;
        const userId = req.jwtDecoded._id;

        const bill = await Bill.findById(billId);

        // Check if the bill exists
        if (!bill) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Bill not found');
        }

        // Check if the user is authorized to delete the bill
        if (bill.ownerId.toString() !== userId) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to delete this bill');
        }

        const deletedBill = await Bill.findByIdAndDelete(billId);
        res.status(StatusCodes.OK).json(deletedBill);
    } catch (error) {
        next(error);
    }
}

const getBillsByTenant = async (req, res, next) => {
    try {
        const tenantId = req.jwtDecoded._id;

        const bills = await Bill.find({ tenantId: tenantId })
            .populate('ownerId', 'displayName email phone')
            .populate('tenantId', 'displayName email phone')
            .populate({
                path: 'roomId',
                select: 'roomId departmentId price',
                populate: {
                    path: 'departmentId',
                    select: 'electricPrice waterPrice '
                }
            })
            .sort({ createdAt: -1 });

        res.status(StatusCodes.OK).json(bills);
    } catch (error) {
        next(error);
    }
}

const sendMail = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id;
        const { billId } = req.query;
        if (billId) {
            const bill = await Bill.findById(billId)
                .populate('ownerId', 'displayName email')
                .populate('tenantId', 'displayName email phone')
                .populate('roomId', 'roomId departmentId price');
            if (!bill) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Bill not found');
            }
            sendEmail('Bill', bill.tenantId.email, 'Bill', generateElectricBillHTML(bill));
            res.status(StatusCodes.OK).json(bill);
        }

    } catch (error) {
        next(error);
    }
}

export const billController = {
    getBills,
    createBill,
    getBillById,
    updateBill,
    deleteBill,
    getBillsByTenant,
    sendMail
}