const { default: mongoose, Schema } = require("mongoose");

const incidentalCostsSchema = new mongoose.Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: "Tenant",
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    whoPaid: {
        type: String,
        enum: ["Landlord", "Tenant"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    }

}, {
    timestamps: true,
})
const IncidentalCosts = mongoose.model("IncidentalCosts", incidentalCostsSchema, "incidentalCosts");
export default IncidentalCosts;
