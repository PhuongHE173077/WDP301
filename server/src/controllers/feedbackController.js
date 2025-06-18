import { StatusCodes } from "http-status-codes"
import Feedback from "~/models/feedbackModel"
import { pickUser } from "~/utils/algorithms"


// Lấy tất cả feedback theo ownerId
const getFeedbacksByOwner = async (req, res) => {
    try {
        const { ownerId } = req.jwtDecoded._id;
        const feedbacks = await Feedback.find({ ownerId });

        const resultData = feedbacks.map((feedback) => {
            return {
                _id: feedback._id,
                tenantName: tenant?.userName || "",
                images: feedback.images,
                status: feedback.status,
                reply: feedback.reply,
                description: feedback.description
            }
        })

        res.status(StatusCodes.OK).json(resultData)
    } catch (error) {
        next(error)
    }
};


export const feedbackController = {
    getFeedbacksByOwner
};