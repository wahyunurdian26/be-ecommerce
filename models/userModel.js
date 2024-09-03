import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name Harus diisi"],
        unique: [true, "Username sudah di gunakan silakan buat yang lain"]
    },
    email: {
        type: String,
        required: [true, "Email Harus diisi"],
        unique: [true, "Email sudah pernah didaftarkan"],
        validate: {
            validator: validator.isEmail,
            message: "inputan harus berformat Email"
        }
    },
    password: {
        type: String,
        required: [true, "Password Harus diisi"],
        minLength: [6, "Password Minimal 6 karakter"],
    },
    role: {
        type: String,
        enum: ["user", "owner"],
        default: "user"
    }
});

userSchema.pre("save", async function () {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    })

  userSchema.methods.comparePassword = async function(reqBody) {
    return await bcrypt.compare(reqBody, this.password)    
  }

const User = mongoose.model("User", userSchema);

export default User;
