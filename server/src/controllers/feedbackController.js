import { StatusCodes } from "http-status-codes"
import Feedback from "~/models/feedbackModel"
import { pickUser } from "~/utils/algorithms"
import OrderRoom from "~/models/orderModel";

// Lấy tất cả feedback theo ownerId
const getFeedbacksByOwner = async (req, res, next) => {
  try {
    const ownerId = req.jwtDecoded._id;
    const feedback = await Feedback.find({ ownerId: ownerId }).populate("tenantId", "displayName");

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

const getMyFeedbacks = async (req, res, next) => {
  try {
    const tenantId = req.jwtDecoded._id;

    const feedbacks = await Feedback.find({ tenantId })
      .populate("ownerId", "displayName");

    const result = feedbacks.map(fb => ({
      _id: fb._id,
      ownerName: fb.ownerId?.displayName || "",
      description: fb.description,
      images: fb.images,
      status: fb.status,
      reply: fb.reply
    }));

    return res.status(200).json(result);
  } catch (err) {
    next(err);
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

const getMyOwners = async (req, res) => {
  try {
    const tenantId = req.jwtDecoded._id;

    const orders = await OrderRoom.find({
      tenantId: { $in: [tenantId] } 
    }).populate({
      path: 'ownerId',
      select: '_id displayName' 
    });

    const owners = orders
      .map(order => order.ownerId)
      .filter(Boolean); 

    const uniqueOwners = Array.from(
      new Map(owners.map(owner => [owner._id.toString(), owner])).values()
    );

    return res.status(200).json(uniqueOwners);
  } catch (err) {
    console.error('🔥 Lỗi lấy danh sách chủ trọ:', err);
    return res.status(500).json({ message: 'Lỗi lấy danh sách chủ trọ', error: err.message });
  }
};


// Tenant send feedback
const createFeedback = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);

    const tenantId = req.jwtDecoded._id;
    const { ownerId, description, images } = req.body; // <-- thêm ownerId

    if (!tenantId || !ownerId) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng." });
    }

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
    console.error("❌ Lỗi tạo feedback:", error);
    next(error);
  }
};



export const feedbackController = {
  getFeedbacksByOwner,
  replyToFeedback,
  createFeedback,
  getMyOwners,
  getMyFeedbacks
};