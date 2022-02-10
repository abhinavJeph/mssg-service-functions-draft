const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    user: {
      name: { type: String, required: true },
      number: { type: Number, required: true },
    },
    status: {
      //passed to worker or not
      type: Boolean,
      default: false,
    },
    operatingTime: {
      type: Number,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    template: {
      templateID: { type: String, required: false },
      params: [{ type: String, required: false }],
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
