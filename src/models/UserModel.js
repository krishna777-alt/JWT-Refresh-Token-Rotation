import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,

  refreshTokens: [
    {
      token: String,
      expiresAt: Date,
      createAt: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
