const Department = require('../models/departmentModel');

// Tạo mới toà nhà (department)
const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách toà nhà theo owner
const getDepartmentsByOwner = async (req, res) => {
  try {
    const departments = await Department.find({
      ownerId: req.params.ownerId,
      _destroy: false,
    });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin tòa nhà
export const updateDepartment = async (req, res) => {
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
export const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.findByIdAndUpdate(
      req.params.id,
      { _destroy: true },
      { new: true }
    )

    if (!deleted) {
      return res.status(404).json({ message: 'Department not found' })
    }

    res.status(200).json({ message: 'Department deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createDepartment,
  getDepartmentsByOwner,
  updateDepartment,
  deleteDepartment
};
