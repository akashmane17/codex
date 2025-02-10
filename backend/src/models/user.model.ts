import mongoose, { CallbackError, Document } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username must not exceed 30 characters"],
    },

    name: {
      type: String,
      default: "",
      trim: true,
      maxlength: [50, "Name must not exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },

  {
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false, // Removes __v field
  }
);

// Pre-save hook to hash passwords
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is not modified

  try {
    const saltRounds = 10;
    this.password = await hashValue(this.password, saltRounds);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Method to validate password
userSchema.methods.validatePassword = async function (password: string) {
  return await compareValue(password, this.password);
};

// Error handling for duplicate key errors
userSchema.post(
  "save",
  function (
    error: CallbackError & {
      code?: number;
      keyPattern?: { email?: string; username?: string };
    },
    doc: Document,
    next: (err?: CallbackError) => void
  ) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      if (error.keyPattern?.email) {
        next(new Error("Email is already in use"));
      } else if (error.keyPattern?.username) {
        next(new Error("Username is already taken"));
      }
    } else {
      next(error);
    }
  }
);

// Indexes for performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Create the model
const User = mongoose.model("User", userSchema);

export default User;
