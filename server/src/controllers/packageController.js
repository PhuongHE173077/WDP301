const { default: Package } = require("~/models/packageModel");

// Tạo gói mới
const createPackage = async (req, res) => {
    try {
        const { name, description, price, availableTime } = req.body;

        const newPackage = await Package.create({ name, description, price, availableTime });
        return res.status(201).json(newPackage);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách gói
const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find({ _destroy: false }).sort({ availableTime: 1 });
        return res.json(packages);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cập nhật gói
const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, availableTime } = req.body;

        const updated = await Package.findByIdAndUpdate(
            id,
            { name, description, price, availableTime },
            { new: true }
        );
        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xoá gói
const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;
        await Package.findByIdAndUpdate(id, { _destroy: true });
        return res.json({ message: 'Xoá gói thành công' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const packageController = {
    getAllPackages,
    createPackage,
    updatePackage,
    deletePackage
}