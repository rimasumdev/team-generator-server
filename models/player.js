import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
      enum: ["Striker", "Midfielder", "Defender", "Goalkeeper"],
    },
    isCaptain: {
      type: Boolean,
      default: false,
    },
    teamName: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Player = mongoose.model("Player", playerSchema);

export default Player;
