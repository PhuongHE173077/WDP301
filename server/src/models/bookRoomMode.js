const { Schema, default: mongoose } = require("mongoose");

const bookRoomSchema = new Schema({
    tenantId: { type: Schema.ObjectId, ref: "Tenant", required: true },
    roomId: { type: Schema.ObjectId, ref: "Room", required: true },
    status: { type: String, enum: ["pending", "reject", "approve"], default: "pending" },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    note: { type: String, default: "" },
    reply: { type: String, default: "" }
},
    {
        timestamps: true
    }
)

const BookRoom = mongoose.model("BookRoom", bookRoomSchema);
export default BookRoom