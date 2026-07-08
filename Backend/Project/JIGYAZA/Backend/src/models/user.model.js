import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required to create a user..."],
      lowercase: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required to create a user..."],
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    displayName: {
      type: String,
    },
    avatar: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = function (CandidatePassword) {
  return bcrypt.compare(CandidatePassword, this.password);
};

const userModel = mongoose.model("user", userSchema);
export default userModel;
