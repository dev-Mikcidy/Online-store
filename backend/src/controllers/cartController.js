import Cart from "../models/cartModel.js";
import Product from "../models/schema/productSchema.js";

const emptyCart = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const formatCart = async (cart) => {
  if (!cart) {
    return emptyCart;
  }

  await cart.populate("items.product");

  const validItems = cart.items.filter((item) => item.product);

  const totalQuantity = validItems.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const totalPrice = validItems.reduce((sum, item) => {
    return sum + Number(item.product.price || 0) * item.quantity;
  }, 0);

  return {
    items: validItems,
    totalQuantity,
    totalPrice,
  };
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    const formattedCart = await formatCart(cart);

    return res.status(200).json(formattedCart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    const amountToAdd = Number(quantity);

    if (!amountToAdd || amountToAdd < 1) {
      return res.status(400).json({ msg: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity: amountToAdd,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find((item) => {
        return item.product.toString() === productId;
      });

      if (existingItem) {
        existingItem.quantity += amountToAdd;
      } else {
        cart.items.push({
          product: productId,
          quantity: amountToAdd,
        });
      }

      await cart.save();
    }

    const formattedCart = await formatCart(cart);

    return res.status(200).json(formattedCart);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    if (quantity === undefined || Number(quantity) < 0) {
      return res.status(400).json({ msg: "Quantity must be 0 or more" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json(emptyCart);
    }

    const newQuantity = Number(quantity);

    if (newQuantity === 0) {
      cart.items = cart.items.filter((item) => {
        return item.product.toString() !== productId;
      });
    } else {
      const item = cart.items.find((item) => {
        return item.product.toString() === productId;
      });

      if (!item) {
        return res.status(404).json({ msg: "Product is not in cart" });
      }

      item.quantity = newQuantity;
    }

    await cart.save();

    const formattedCart = await formatCart(cart);

    return res.status(200).json(formattedCart);
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json(emptyCart);
    }

    cart.items = cart.items.filter((item) => {
      return item.product.toString() !== productId;
    });

    await cart.save();

    const formattedCart = await formatCart(cart);

    return res.status(200).json(formattedCart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json(emptyCart);
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json(emptyCart);
  } catch (error) {
    next(error);
  }
};
