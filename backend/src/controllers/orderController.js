import Order from "../models/schema/orderSchema.js";

class OrderController {

  async getUserOrders(req, res, next) {
    try {
      console.log(req.user.id)
      const result = await Order.find({ userId: req.user.id});;
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
