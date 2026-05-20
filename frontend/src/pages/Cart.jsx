import "../styles/Cart.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";

function Cart() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(CartContext);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          cartItems,
        }),
      });

      const data = await response.json();

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your Cart</h1>

        <p>Your cart is empty.</p>

        <Link to="/products">Continue Shopping</Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.map((product) => (
        <section className="cart-item" key={product._id}>
          <div className="cart-item-image">
            <img src={product.image} alt={product.name} width="200" />
          </div>

          <div className="cart-item-info">
            <h2>{product.name}</h2>
            <p>{product.model}</p>
            <p>{product.price} SEK</p>
            {product.quantity > 1 && (
            <p>
              Subtotal: {(product.price * product.quantity).toFixed(2)} SEK
            </p>
          )}

            <div className="cart-quantity-controls">
              <button onClick={() => decreaseQuantity(product._id)}>-</button>

              <span>{product.quantity}</span>

              <button onClick={() => increaseQuantity(product._id)}>+</button>
              <button onClick={() => removeFromCart(product._id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        </section>
      ))}

      <section className="cart-summary">
        <h2>Total: {totalAmount.toFixed(2)} SEK</h2>

        <button className="checkout-button" onClick={handleCheckout}>
          Checkout
        </button>
      </section>

      <Link to="/products" className="continue-shopping-button">
        Continue Shopping
      </Link>
    </main>
  );
}

export default Cart;
