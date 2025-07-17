import Blog from "~/models/blogModel";
import OrderRoom from "~/models/orderModel";
import Room from "~/models/roomModel";
import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { pickUser } from "~/utils/algorithms";
import ApiError from "~/utils/ApiError";

const addRoomToBlog = async (req, res) => {
  const roomId = req.params.id;
  const ownerId = req.jwtDecoded._id;
  const { force, title, description, availableFrom } = req.body;

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Không tìm thấy phòng." });

  // Đã blog rồi (room.post = true) → thông báo nếu không force
  if (room.post === true && !force) {
    return res.status(200).json({ existed: true });
  }

  // Nếu phòng đang có người thuê nhưng không force → cảnh báo
  if (room.status === true && !force) {
    const order = await OrderRoom.findOne({ roomId, _destroy: false });
    const endDate = order?.endAt || new Date();
    return res.status(200).json({
      warning: true,
      note: `Phòng đang được thuê đến ${dayjs(endDate).format("DD/MM/YYYY")}`,
      endAt: endDate
    });
  }

  // Trường title là bắt buộc khi force
  if (!title) {
    return res.status(400).json({ message: "Tiêu đề (title) là bắt buộc." });
  }

  // Kiểm tra blog đã tồn tại nhưng đã xoá mềm chưa
  const existingSoftDeleted = await Blog.findOne({ roomId, ownerId, _destroy: true });

  if (existingSoftDeleted) {
    // Khôi phục lại blog cũ
    existingSoftDeleted.title = title;
    existingSoftDeleted.description = description;
    existingSoftDeleted.availableFrom = availableFrom ? new Date(availableFrom) : new Date();
    existingSoftDeleted._destroy = false;
    await existingSoftDeleted.save();

    room.post = true;
    await room.save();

    return res.status(201).json({ message: "Khôi phục blog thành công.", blog: existingSoftDeleted });
  }

  // Nếu chưa từng có blog, tạo mới
  const blog = await Blog.create({
    roomId,
    ownerId,
    title,
    description,
    availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
    _destroy: false
  });
  
  room.post = true;
  await room.save();

  return res.status(201).json({ message: "Phòng đã được thêm vào blog.", blog });
};

const checkRoomStatus = async (req, res) => {
  const { roomId } = req.params;

  // Tìm xem phòng đã có trong blog chưa
  const existed = await Blog.findOne({ room: roomId, _destroy: false });

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });

  const warning = room.status === true; // true nếu có người thuê
  const endAt = warning ? room.endDate : null;

  return res.status(200).json({ existed: !!existed, warning, endAt });
};

const removeRoomFromBlog = async (req, res) => {
  try {
    const roomId = req.params.id;

    // Tìm và xoá blog theo roomId và ownerId
    const deleted = await Blog.findOneAndUpdate({
      roomId,
      ownerId: req.jwtDecoded._id
    },{_destroy: true}, {new: true});

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy blog để xoá." });
    }

    // Cập nhật lại trạng thái post của phòng
    await Room.findByIdAndUpdate(roomId, { post: false });

    return res.status(200).json({ message: "Đã xoá khỏi blog thành công." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const getBlogById = async (req, res, next) => {
  try {
    const id = req.params.id
    const blog = await Blog.findById(id)
      .populate({
        path: 'roomId',
        populate: {
          path: 'departmentId',
          model: 'Department'
        }
      })
      .populate('ownerId');

    if (!blog) return next(new ApiError(StatusCodes.NOT_FOUND, 'Blog not found!'))

    res.status(StatusCodes.OK).json({
      _id: blog._id,
      room: blog.roomId,
      owner: pickUser(blog.ownerId),
      availableFrom: blog.availableFrom,
      description: blog.description,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    })
  } catch (error) {
    next(error)
  }
}
const getAllBlog = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate({
      path: 'roomId',
      populate: {
        path: 'departmentId',
        model: 'Department'
      }
    })
      .populate('ownerId');
    res.status(StatusCodes.OK).json(blogs);
  } catch (error) {
    next(error);
  }
}

export const blogController = {
  addRoomToBlog,
  getBlogById, 
  checkRoomStatus, 
  removeRoomFromBlog,
  getBlogById,
  getAllBlog
};
