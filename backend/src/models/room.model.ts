import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    room_id: {
      type: String,
      required: [true, "Room Id is required"],
      unique: true,
      trim: true,
    },

    expiry_date: {
      type: Date,
      required: [true, "Expiry date is required"],
    },

    document: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false, // Removes __v field
  }
);

roomSchema.index({ room_id: 1 });

const Room = mongoose.model("Room", roomSchema);

export default Room;
