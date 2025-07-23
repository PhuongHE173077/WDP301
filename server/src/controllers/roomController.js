import Department from "~/models/departmentModel"
import OrderRoom from "~/models/orderModel"
import Room from "~/models/roomModel"
import ApiError from "~/utils/ApiError"

// Lấy danh sách phòng theo departmentId
const getRoomsByDepartment = async (req, res) => {
  try {
    const { id: departmentId } = req.params

    if (!departmentId) {
      return res.status(400).json({ message: 'Thiếu thông tin departmentId' })
    }

    const rooms = await Room.find({
      departmentId,
      _destroy: false
    })

    res.status(200).json(rooms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// (Tùy chọn) Tạo phòng mới - nếu bạn cần
const createRoom = async (req, res, next) => {
  try {
    const {
      roomId,
      image,
      price,
      area,
      utilities,
      serviceFee,
      departmentId,
      post = false,
      status = false,
      type = "Phòng trọ"
    } = req.body;

    const ownerId = req.jwtDecoded?._id
    // Kiểm tra các trường bắt buộc
    if (!roomId || !price || !departmentId || !ownerId) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      throw new ApiError(404, "Department not found");
    }
    const existingRoom = await Room.findOne({ roomId, departmentId, _destroy: false });

    if (existingRoom) {
      throw new ApiError(400, "Phòng đã tồn tại trong phòng trọ này");
    }
    // Tạo Room
    const newRoom = await Room.create({
      roomId,
      image,
      price,
      area,
      utilities,
      serviceFee,
      departmentId,
      post,
      status,
      type,
      _destroy: false
    });


    // Tạo OrderRoom mặc định gắn với Room mới
    await OrderRoom.create({
      roomId: newRoom._id,
      ownerId: ownerId,
      tenantId: [],
      contract: null,
      startAt: null,
      endAt: null,
      oldElectricNumber: 0,
      history: [],
      _destroy: false
    });

    return res.status(201).json({
      message: "Tạo phòng và đơn thuê thành công!",
      room: newRoom
    });
  } catch (error) {
    next(error);
  }
};

// Xoá mềm phòng (_destroy = true)
const deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndUpdate(
      req.params.id,
      { _destroy: true },
      { new: true }
    )

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy phòng' })
    }

    res.status(200).json({ message: 'Xoá phòng thành công' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
//Cập nhật thông tin phòng
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params
    const updatedData = req.body

    const updatedRoom = await Room.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    })

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Không tìm thấy phòng để cập nhật' })
    }

    res.status(200).json({
      message: 'Cập nhật phòng thành công',
      room: updatedRoom
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//lấy thông tin phòng theo id
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)

    if (!room || room._destroy) {
      return res.status(404).json({ message: 'Không tìm thấy phòng' })
    }

    res.status(200).json(room)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllRooms = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const rooms = await Room.find({ _destroy: false })
      .populate('departmentId', 'name ownerId')
    const results = rooms.filter(room => room.departmentId.ownerId.toString() === userId.toString());
    res.status(200).json(results);
  } catch (error) {
    next(error)
  }
}

export const roomController = {
  getRoomsByDepartment,
  createRoom,
  deleteRoom,
  updateRoom,
  getRoomById,
  getAllRooms
}
