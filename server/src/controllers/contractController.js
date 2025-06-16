import { StatusCodes } from "http-status-codes";
import { fileMiddleware } from "~/middlewares/fileMiddleware";
import Contract from "~/models/contractModel";
import OrderRoom from "~/models/orderModel";
import { cloudinaryProvider } from "~/providers/CloudinaryProvider";
import { sendEmail } from "~/providers/MailProvider";
import { WEBSITE_DOMAIN } from "~/utils/constants";
import { generateContractAppendixHTML } from "~/utils/form-html";
const path = require('path');
const createNew = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const file = req.file

        const order = await OrderRoom.findOne({ _id: orderId, _destroy: false }).populate('roomId').populate('tenantId').populate('ownerId').populate('contract')
        if (!order) return next(new ApiError(StatusCodes.NOT_FOUND, 'Order not found!'))

        const fileNameWithExt = path.parse(file.originalname).name + path.extname(file.originalname);
        const sanitized = fileNameWithExt.replace(/\s+/g, '_');
        const resultUpload = await cloudinaryProvider.streamUploadFile(file.buffer, 'contracts', sanitized)

        const dataNew = {
            tenantId: order.tenantId.map(t => t._id),
            ownerId: order.ownerId._id,
            contractURI: resultUpload.secure_url,
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

export const contractController = {
    createNew
}