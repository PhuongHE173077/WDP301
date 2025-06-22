import { StatusCodes } from "http-status-codes"
import Feedback from "~/models/feedbackModel"
import { pickUser } from "~/utils/algorithms"


// Lấy tất cả feedback theo ownerId
const getFeedbacksByOwner = async (req, res, next) => {
    try {
        const ownerId = req.jwtDecoded._id;
        const feedback = await Feedback.find({ ownerId: ownerId }).populate("tenantId");
        const resultData = feedback.map((feedback) => {
            return {
                _id: feedback._id,
                tenantName: feedback.tenantId?.userName || "",
                description: feedback.description,
                images: feedback.images,
                status: feedback.status,
                reply: feedback.reply
            }
        });

        res.status(StatusCodes.OK).json(resultData);
    } catch (error) {
        next(error);
    }
};

// Owner trả lời feedback
const replyToFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      {
        reply,
        status: "Replied", // cập nhật trạng thái luôn nếu có phản hồi
      },
      { new: true } // trả về bản ghi sau khi update
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json(updatedFeedback);
  } catch (error) {
    next(error);
  }
};



export const feedbackController = {
    getFeedbacksByOwner,
    replyToFeedback
};