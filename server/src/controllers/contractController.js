import { StatusCodes } from "http-status-codes";
import { fileMiddleware } from "~/middlewares/fileMiddleware";
import Contract from "~/models/contractModel";
import OrderRoom from "~/models/orderModel";
import Room from "~/models/roomModel";
import { cloudinaryProvider } from "~/providers/CloudinaryProvider";
import { sendEmail } from "~/providers/MailProvider";
import { pickUser } from "~/utils/algorithms";
import { WEBSITE_DOMAIN } from "~/utils/constants";
import { generateContractAppendixHTML } from "~/utils/form-html";
const path = require('path');
const createNew = async (req, res, next) => {
    try {
        const { orderId, deposit, content, signature_A } = req.body;
        const file = req.file

        const order = await OrderRoom.findOne({ _id: orderId, _destroy: false }).populate('roomId').populate('tenantId').populate('ownerId').populate('contract')
        if (!order) return next(new ApiError(StatusCodes.NOT_FOUND, 'Order not found!'))

        const fileNameWithExt = path.parse(file.originalname).name + path.extname(file.originalname);
        const sanitized = fileNameWithExt.replace(/\s+/g, '_');
        const resultUpload = await cloudinaryProvider.streamUploadFile(file.buffer, 'contracts', sanitized)

        const dataNew = {
            tenantId: order.tenantId.map(t => t._id),
            ownerId: order.ownerId._id,
            roomId: order.roomId._id,
            content: content,
            signature_A: signature_A,
            contractURI: resultUpload.secure_url,
            deposit: parseInt(deposit),
            image1CCCD: "",
            image2CCCD: "",
            status: 'pending_signature',
        }

        const newContract = await Contract.create(dataNew)

        const orderUpload = await OrderRoom.findOneAndUpdate({ _id: orderId }, { contract: newContract._id }, { new: true })

        const html = generateContractAppendixHTML(WEBSITE_DOMAIN, order.tenantId, dataNew.contractURI);

        await Promise.all([
            sendEmail('RoomRentPro', order.ownerId.email, "Tạo hợp đồng trọ", html),
            ...order.tenantId.map(tenant => sendEmail('RoomRentPro', tenant.email, "Tạo hợp đồng trọ", html)),
        ]);

        res.status(StatusCodes.CREATED).json(orderUpload);
    } catch (error) {
        next(error)
    }
}


const getContractsByTenantId = async (req, res, next) => {
    try {
        const tenantId = req.jwtDecoded._id
        const contracts = await Contract.find({ tenantId: tenantId }).populate('tenantId').populate('ownerId').populate('roomId').sort({ createdAt: -1 })
        res.status(StatusCodes.OK).json(contracts.map(c => {
            return {
                _id: c._id,
                tenant: c.tenantId.map(t => pickUser(t)),
                owner: pickUser(c.ownerId),
                room: c.roomId,
                contractURI: c.contractURI,
                deposit: c.deposit,
                reason: c.reason,
                image1CCCD: c.image1CCCD,
                image2CCCD: c.image2CCCD,
                status: c.status,
                paid: c.paid,
                createdAt: c.createdAt
            }
        }))
    } catch (error) {
        next(error)
    }
}

const updateContract = async (req, res, next) => {
    try {
        const file = req.file
        const id = req.params.id
        const { signature_B, image1CCCD, image2CCCD } = req.body
        if (file) {
            const fileNameWithExt = path.parse(file.originalname).name + path.extname(file.originalname);
            const sanitized = fileNameWithExt.replace(/\s+/g, '_');
            const resultUpload = await cloudinaryProvider.streamUploadFile(file.buffer, 'contracts', sanitized)
            const dataUpdate = {
                signature_B: signature_B,
                image1CCCD: image1CCCD,
                image2CCCD: image2CCCD,
                contractURI: resultUpload.secure_url,
                status: 'pending_review'
            }
            const contract = await Contract.findOneAndUpdate({ _id: id }, dataUpdate, { new: true })
            res.status(StatusCodes.OK).json(contract)
        }
        const contract = await Contract.findByIdAndUpdate(id, req.body, { new: true })
        if (req.body.paid) {
            await Room.findByIdAndUpdate(contract.roomId, { status: true })
        }
        res.status(StatusCodes.OK).json({ message: 'Update contract successfully' })
    } catch (error) {
        next(error)
    }
}

export const contractController = {
    createNew,
    getContractsByTenantId,
    updateContract
}