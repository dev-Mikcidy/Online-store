import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantityBought: { type: Number, required: true, min: 0 },
    },
  ],
  totalPrice: { type: Number, required: true, min: 0 },
  timeCreated: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
