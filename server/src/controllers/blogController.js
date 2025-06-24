import Blog from "~/models/blogModel";
import OrderRoom from "~/models/orderModel";
import Room from "~/models/roomModel";
import dayjs from "dayjs";

const addRoomToBlog = async (req, res) => {
  const roomId = req.params.id;
  const force = req.body.force;

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Không tìm thấy phòng." });

  if (room.post === true) {
    return res.status(400).json({ message: "Phòng đã có trong blog.", existed: true });
  }

  if (room.status === true && !force) {
    const order = await OrderRoom.findOne({ roomId, _destroy: false });
    const endDate = order?.endAt;

    return res.status(200).json({
      warning: true,
      note: endDate
        ? `Phòng đang được thuê đến ${dayjs(endDate).format("DD/MM/YYYY")}, bắt đầu trống từ ngày này.`
        : "Phòng đang được thuê.",
      endAt: endDate || null
    });
  }

  // Xác định ngày availableFrom
  let availableFrom = null;
  if (room.status === true) {
    const order = await OrderRoom.findOne({ roomId, _destroy: false });
    availableFrom = order?.endAt || null;
  }

  // Mô tả tùy theo ngày có sẵn hay không
  const description = availableFrom
    ? `Phòng bắt đầu trống từ ${dayjs(availableFrom).format("DD/MM/YYYY")}`
    : "Phòng hiện đang trống";

  const blog = await Blog.create({
    roomId,
    ownerId: req.jwtDecoded._id,
    availableFrom,
    description
  });

  // Cập nhật trạng thái phòng
  room.post = true;
  await room.save();

  return res.status(201).json({ message: "Phòng đã được thêm vào blog.", blog });
};

export const blogController = {
  addRoomToBlog
};
