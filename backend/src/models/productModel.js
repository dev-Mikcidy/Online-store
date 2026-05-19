import Product from "./schema/productSchema.js";

class ProductModel {
  async getAllProducts() {
    return await Product.find({});
  }

  async getProductsByCategory(category) {
    return await Product.find({ category });
  }

  async searchProducts(searchStr) {
    return await Product.find({
      $or: [
        { name: { $regex: searchStr, $options: "i" } },
        { model: { $regex: searchStr, $options: "i" } },
      ],
    });
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async updateProduct(id, quantity) {
    await Product.updateOne(
      { _id: id, quantity: { $gte: quantity } },
      { $inc: { quantity: -quantity } },
    );
  }
}

export default new ProductModel();
