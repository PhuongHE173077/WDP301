import mongoose from "mongoose";

const serviceFeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        unit: { type: String, required: true },
    },
    { _id: false }
);

const roomSchema = new mongoose.Schema(
    {
        roomId: { type: String, required: true, unique: true },
        image: { type: String, default: "" },
        price: { type: Number, required: true },
        area: { type: String },
        utilities: { type: String },
        serviceFee: [serviceFeeSchema],
        _destroy: { type: Boolean, default: false },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
