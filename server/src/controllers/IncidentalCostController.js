import { StatusCodes } from "http-status-codes";
import Department from "~/models/departmentModel";
import IncidentalCosts from "~/models/incidentalCostsModel";
import OrderRoom from "~/models/orderModel";
import Room from "~/models/roomModel";
import ApiError from "~/utils/ApiError";

const getAllIncidentalCosts = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id;
        const incidentalCosts = await IncidentalCosts.find({ ownerId: userId })
            .populate('roomId', 'roomId departmentId price')
            .populate('tenantId', 'displayName email phone')
            .populate('ownerId', 'displayName email phone')
            .sort({ createdAt: -1 });

        res.status(StatusCodes.OK).json(incidentalCosts);
    } catch (error) {
        next(error);
    }
}

const createIncidentalCost = async (req, res, next) => {
    try {
        const { roomId, description, whoPaid, amount } = req.body;
        const userId = req.jwtDecoded._id;

        const roomExists = await Room.findById(roomId);
        // Check if the room exists and belongs to the user
        if (!roomExists) {
            throw new ApiError(404, "Room not found");
        }

        const departmentExists = await Department.findById(roomExists.departmentId);

        // Check if the department exists and belongs to the user
        if (!departmentExists) {
            throw new ApiError(404, "Department not found");
        }

        // Ensure the department belongs to the user
        if (departmentExists.ownerId.toString() !== userId.toString()) {
            throw new ApiError(403, "You do not have permission to create incidental costs for this department");
        }

        const Order = await OrderRoom.findOne({
            roomId: roomId
        });


        const incidentalCost = new IncidentalCosts({
            roomId,
            tenantId: Order.tenantId[0] || null,
            whoPaid,
            amount,
            ownerId: userId,
            description: description || "No description provided",
            isPaid: whoPaid === "Landlord" ? true : false
        });

        await incidentalCost.save();
        res.status(201).json(incidentalCost);
    } catch (error) {
        next(error);
    }
}

const deleteIncidentalCost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.jwtDecoded._id;

        const incidentalCost = await IncidentalCosts.findById(id);
        if (!incidentalCost) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Incidental cost not found");
        }

        await IncidentalCosts.deleteOne({ _id: id, ownerId: userId });

        res.status(StatusCodes.NO_CONTENT).json({ message: "Incidental cost deleted successfully" });

    } catch (error) {
        next(error);
    }
}

const updateIncidentalCost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.jwtDecoded._id;
        const { roomId, description, whoPaid, amount, isPaid } = req.body;
        const incidentalCost = await IncidentalCosts.findById(id);
        if (!incidentalCost) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Incidental cost not found");
        }
        // Ensure the incidental cost belongs to the user
        if (incidentalCost.ownerId.toString() !== userId.toString()) {
            throw new ApiError(StatusCodes.FORBIDDEN, "You do not have permission to update this incidental cost");
        }

        incidentalCost.roomId = roomId;
        incidentalCost.description = description;
        incidentalCost.whoPaid = whoPaid;
        incidentalCost.amount = amount;
        incidentalCost.isPaid = isPaid;

        await incidentalCost.save();
        res.status(StatusCodes.OK).json(incidentalCost);
    } catch (error) {
        next(error);

    }
}

export const incidentalCostsController = {
    getAllIncidentalCosts,
    createIncidentalCost,
    deleteIncidentalCost,
    updateIncidentalCost
}