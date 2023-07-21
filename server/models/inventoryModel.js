const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: true,
      enum: ["in", "out"],
    },
    bloodGroup: {
      type: String,
      required: true,
      enums: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    //if inventory type is "out" then hospital will be set
    //if inventory type is "in" then donar will be set
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        if (this.inventoryType === "out") {
          return true;
        }
        return false;
      },
    },
    donar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        if (this.inventoryType === "in") {
          return true;
        }
        return false;
      },
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("inventories", inventorySchema);

module.exports = Inventory;
