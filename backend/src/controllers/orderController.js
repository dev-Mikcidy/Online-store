import order from "../models/orderModel.js";

class OrderController {
  async getAllOrders(req, res, next) {
    try {
      const result = await order.getAllOrders();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const { userId } = req.body;
      const result = await order.getUserOrders(userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
