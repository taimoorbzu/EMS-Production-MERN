import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        zipCode: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const employeeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Employee must be linked to a user"],
        unique: true,
    },
    employeeCode: {
        type: String,
        required: [true, "Employee Code is required"],
        trim: true,
        unique: true,
        uppercase: true,
    },
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: [true, "Department is required"],
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null,
        validate: {
            validator: function (value) {
                // On update queries `this` is a Query and has no _id, so skip the check there
                if (!value || !this._id) return true;
                return String(this._id) !== String(value);
            },
            message: "An employee cannot report to themselves",
        },
    },
    jobTitle: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
    },
    salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [0, "Salary cannot be negative"]
    },
    hireDate: {
        type: Date,
        required: [true, "Hire date is required"],
        default: Date.now
    },
    address: {
        type: addressSchema,
        default: () => ({}),
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
            return ret;
        },
    }
})

// 3. Full name virtual
employeeSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// 4. Query indexes
employeeSchema.index({ departmentId: 1, deletedAt: 1 });
employeeSchema.index({ managerId: 1, deletedAt: 1 });
employeeSchema.index({ deletedAt: 1 });
employeeSchema.index({ lastName: 1, firstName: 1 });

// 5. Automatically exclude soft-deleted employees (unless includeDeleted: true)
const excludeSoftDeleted = function () {
    if (this.getOptions().includeDeleted === true) {
        return;
    }
    this.where({ deletedAt: null });
};

employeeSchema.pre(/^find/, excludeSoftDeleted);
employeeSchema.pre(["countDocuments", "count"], excludeSoftDeleted);

// 6. Block self-reporting on update queries (the document validator can't see the target)
employeeSchema.pre(["updateOne", "findOneAndUpdate"], function () {
    const update = this.getUpdate() || {};
    const managerId = update.managerId ?? update.$set?.managerId;
    const targetId = this.getFilter()._id;

    if (managerId && targetId && String(managerId) === String(targetId)) {
        throw new Error("An employee cannot report to themselves");
    }
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;