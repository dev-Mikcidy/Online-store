import Order from "./schema/orderSchema.js";

class OrderModel {
  async getAllOrders() {
    return await Order.find();
  }

  async getUserOrders(userId) {
    return await Order.find({ userId, status: "paid"});
  }
}

export default new OrderModel()