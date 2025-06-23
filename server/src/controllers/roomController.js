import Room from "~/models/roomModel"

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
const createRoom = async (req, res) => {
  try {
    const {
      roomId,
      image,
      price,
      area,
      utilities,
      serviceFee,
      departmentId,
      post = true,
      status = true,
      type = "Phòng trọ"
    } = req.body

    if (!roomId || !price || !departmentId) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' })
    }

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
      type
    })

    res.status(201).json(newRoom)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

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

export const roomController = {
  getRoomsByDepartment,
  createRoom, 
  deleteRoom,
  updateRoom,
  getRoomById
}
