import Admin from "../models/schema/userSchema.js";

class adminController {

    async addProduct(req, res) {
        try {

            const name = String(req.body.name || "").trim();
            const model = String(req.body.model || "").trim();
            const category = String(req.body.category || "").trim();
            const description = String(req.body.description || "").trim();

            let specifications = req.body.specifications || {};

            if (typeof specifications === "string") {
                try {
                    specifications = JSON.parse(specifications);
                } catch (error) {
                    return res.status(400).json({
                        msg: "Specifications must be a valid JSON object"
                    });
                }
            }

            const image = String(req.body.image || "").trim();
            const price = Number(req.body.price);
            const quantity = Number(req.body.quantity);


            if (!name) {
                return res.status(400).json({
                    msg: "Product name is required"
                });
            }

            if (!model) {
                return res.status(400).json({
                    msg: "Model name is required"
                });
            }

            if (!category) {
                return res.status(400).json({
                    msg: "Category is required"
                });
            }

            const allowedCategories = [
                "Phone",
                "Laptop",
                "Television",
                "Accessories"
            ];

            if (!allowedCategories.includes(category)) {
                return res.status(400).json({
                    msg: `Category must be one of: ${allowedCategories.join(", ")}`
                });
            }

            if (!description) {
                return res.status(400).json({
                    msg: "Description is required"
                });
            }

            if (!image) {
                return res.status(400).json({
                    msg: "Image is required"
                });
            }

            if (isNaN(price) || price < 0) {
                return res.status(400).json({
                    msg: "Price must be a valid number"
                });
            }

            if (isNaN(quantity) || quantity < 0) {
                return res.status(400).json({
                    msg: "Quantity must be a valid number"
                });
            }


            const existingProduct = await Product.findOne({
                name,
                model
            });

            if (existingProduct) {
                return res.status(400).json({
                    msg: "Product already exists"
                });
            }

            const product = await Product.create({
                name,
                model,
                category,
                description,
                specifications,
                image,
                price,
                quantity
            });

            return res.status(201).json({
                msg: "Product added successfully",
                product
            });

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            });
        }
    }
    async getAdminProfile(req, res) {
        try {
            const admin = await Admin.findById(req.user.id).select("-password");

            if (!admin) {
                return res.status(404).json({
                    msg: "Admin not found"
                });
            }

            return res.json({
                msg: "Admin profile fetched successfully",
                admin
            });

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            });
        }
    }


    async updateProduct(req, res) {
        try {

            const { id } = req.params;

            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updatedProduct) {
                return res.status(404).json({
                    msg: "Product not found"
                });
            }

            return res.json({
                msg: "Product updated successfully",
                product: updatedProduct
            });

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            });
        }
    }

    async deleteProduct(req, res) {
        try {

            const { id } = req.params;

            const deletedProduct = await Product.findByIdAndDelete(id);

            if (!deletedProduct) {
                return res.status(404).json({
                    msg: "Product not found"
                });
            }

            return res.json({
                msg: "Product deleted successfully",
                product: deletedProduct
            });

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            });
        }
    }

    async getAllProducts(req, res) {
        try {

            const products = await Product.find().sort({
                timeCreated: -1
            });

            return res.json(products);

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            });
        }
    }
   
    async getSingleProduct(req, res) {
        try {

            const { id } = req.params;

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({
                    msg: "Product not found"
                });
            }

            return res.json(product);

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            });
        }
    }

}

export default new adminController();