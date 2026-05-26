import mongoose from "mongoose";
import CartSchema from "./schema/cartSchema.js";

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
