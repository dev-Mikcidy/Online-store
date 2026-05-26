import "../styles/Cart.css";

import { Link } from "react-router-dom";

import { useContext } from "react";

import { CartContext } from "../context/CartContext";

import { FaTrash } from "react-icons/fa";

function Cart() {
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3001";

  // UPDATED CART STRUCTURE
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const totalAmount = cart.totalPrice;

  const handleCheckout = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await fetch(
        `${API_URL}/api/create-checkout-session`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            userId: user?.id ?? null,

            // FIXED CHECKOUT PAYLOAD
            cartItems: cart.items.map(
              (item) => ({
                ...item.product,
                quantity: item.quantity,
              })
            ),
          }),
        }
      );

      const data =
        await response.json();

      window.location.href = data.url;

    } catch (error) {
      console.error(error);
    }
  };

  // EMPTY CART
  if (cart.items.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your Cart</h1>

        <p>Your cart is empty.</p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Your Cart</h1>

      {cart.items.map((item) => (
        <section
          className="cart-item"
          key={item.product._id}
        >
          <div className="cart-item-image">
            <img
              src={item.product.image}
              alt={item.product.name}
              width="200"
            />
          </div>

          <div className="cart-item-info">
            <h2>
              {item.product.name}
            </h2>

            <p>
              {item.product.model}
            </p>

            <p>
              {item.product.price} SEK
            </p>

            {item.quantity > 1 && (
              <p>
                Subtotal:{" "}
                {(
                  item.product.price *
                  item.quantity
                ).toFixed(2)}{" "}
                SEK
              </p>
            )}

            <div className="cart-quantity-controls">
              <button
                onClick={() =>
                  decreaseQuantity(
                    item.product._id
                  )
                }
              >
                -
              </button>

              <span>
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  increaseQuantity(
                    item.product._id
                  )
                }
              >
                +
              </button>

              <button
                onClick={() =>
                  removeFromCart(
                    item.product._id
                  )
                }
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </section>
      ))}

      <section className="cart-summary">
        <h2>
          Total:{" "}
          {totalAmount.toFixed(2)} SEK
        </h2>

        <button
          className="checkout-button"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </section>

      <Link
        to="/products"
        className="continue-shopping-button"
      >
        Continue Shopping
      </Link>
    </main>
  );
}

export default Cart;