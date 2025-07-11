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
        tenantName: feedback.tenantId?.displayName || "",
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
const replyToFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      {
        reply,
        status: "Replied",
      },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Không tìm thấy phản hồi để cập nhật." });
    }

    res.status(200).json({
      message: "Phản hồi thành công.",
      data: updatedFeedback,
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Tenant send feedback
const createFeedback = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const ownerId = req.jwtDecoded._id; // hoặc lấy từ mối quan hệ nào đó
    const tenantId = req.jwtDecoded._id;
    const { description, images } = req.body;

    const feedback = await Feedback.create({
      tenantId,
      ownerId,
      description,
      images,
      status: "Pending",
      reply: ""
    });

    res.status(201).json({
      message: "Feedback đã được gửi",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};



export const feedbackController = {
  getFeedbacksByOwner,
  replyToFeedback,
  createFeedback
};