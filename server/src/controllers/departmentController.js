import Room from '~/models/roomModel';

const Department = require('../models/departmentModel');

// Tạo mới toà nhà (department)
const createDepartment = async (req, res) => {
  try {
    const {
      name,
      electricPrice,
      waterPrice,
      province,
      district,
      commune,
      village,
    } = req.body;

    if (!name || !electricPrice || !waterPrice || !province || !district || !commune || !village) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
    }

    const ownerId = req.jwtDecoded?._id;
    if (!ownerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const newDepartment = await Department.create({
      ownerId,
      name,
      electricPrice,
      waterPrice,
      province,
      district,
      commune,
      village,
    });

    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Lấy danh sách toà nhà theo owner
const getDepartmentsByOwner = async (req, res) => {
  try {
    const userId = req.jwtDecoded._id
    const departments = await Department.find({
      ownerId: userId,
      _destroy: false,
    });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin tòa nhà
 const updateDepartment = async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // trả về document đã cập nhật
    )

    if (!updatedDepartment) {
      return res.status(404).json({ message: 'Department not found' })
    }

    res.status(200).json(updatedDepartment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Xoá mềm tòa nhà (_destroy = true)
 const deleteDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;

    // Kiểm tra tòa nhà có tồn tại không
    const department = await Department.findById(departmentId);
    if (!department || department._destroy) {
      return res.status(404).json({ message: 'Không tìm thấy tòa nhà' });
    }

    // Tìm các phòng thuộc tòa nhà này
    const rooms = await Room.find({ departmentId, _destroy: false });

    // Kiểm tra xem có phòng nào đang có người thuê không (status = true là đang có người thuê)
    const hasOccupiedRoom = rooms.some((room) => room.status === true);
    if (hasOccupiedRoom) {

      return res.status(400).json({ message: 'Không thể xoá tòa nhà vì có phòng đang được thuê' });
    }

    // Xoá mềm tất cả phòng thuộc tòa nhà này
    await Room.updateMany({ departmentId }, { _destroy: true });

    // Xoá mềm tòa nhà
    await Department.findByIdAndUpdate(departmentId, { _destroy: true });

    return res.status(200).json({ message: 'Xoá tòa nhà thành công (đã xoá mềm)' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Lấy toà nhà theo id
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department || department._destroy) {
      return res.status(404).json({ message: 'Không tìm thấy toà nhà' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const departmentController = {
  createDepartment,
  getDepartmentsByOwner,
  updateDepartment,
  deleteDepartment,
  getDepartmentById
}


