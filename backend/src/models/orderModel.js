import Order from "./schema/orderSchema.js";

class OrderModel {
  async getAllOrders() {
    return await Order.find({});
  }

  async getUserOrders(id) {
    return await Order.find({ userId: id});
  }
}

export default new OrderModel()