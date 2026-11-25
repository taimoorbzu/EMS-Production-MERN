import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from "validator";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return validator.isEmail(v);
            },
            message: "Please enter a valid email address"
        }
    },
    passwordHash: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters long"],
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "employee", "manager", "hr"],
        default: "employee",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            delete ret.passwordHash;
            delete ret.__v;
            return ret;
        }
    }
});


// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("passwordHash")) return;

    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!candidatePassword || !this.passwordHash) {
        return false;
    }

    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;