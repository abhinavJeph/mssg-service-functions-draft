const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    limiters: [
      {
        name: {
          type: String,
          required: true,
        },
        duration: {
          type: Number,
          default: 1000,
        },
        count: {
          type: Number,
          default: 0,
        },
        time: {
          type: Number,
          default: 0,
        },
        maxLimit: {
          type: Number,
          default: 10,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
