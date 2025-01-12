const { Schema, model } = require("mongoose");
const {
  REFRESH,
  RESET_PASSWORD,
  VERIFY_EMAIL,
} = require("../config/tokenTypes");

const TokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [REFRESH, RESET_PASSWORD, VERIFY_EMAIL],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Token = model("Token", TokenSchema);
module.exports = Token;
