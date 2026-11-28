import mongoose from "mongoose";

const departmentScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide department name."],
        unique: true,
        trim: true,
        lowercase: true,
    },
    code: {
        type: String,
        required: [true, "Please provide department code."],
        unique: true,
        trim: true,
        uppercase: true,
    },
    headId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null,
    },
    budget: {
        type: Number,
        min: [0, "Department budget cannot be negative."],
        default: 0,
    },
    description: {
        type: String,
        required: [true, "Please provide department description."],
        trim: true,
    }
}, {
    timestamps: true
});

const Department = mongoose.model("Department", departmentScheme);
export default Department;