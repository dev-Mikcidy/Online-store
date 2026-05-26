import {
  useEffect,
  useContext,
} from "react";

import { Link } from "react-router-dom";

import { CartContext }
from "../context/CartContext";

function Success() {
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3001";

  const { clearCart } =
    useContext(CartContext);

  useEffect(() => {
    async function handleSuccess() {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) return;

        // CLEAR BACKEND CART
        await fetch(
          `${API_URL}/api/cart`,
          {
            method: "DELETE",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // CLEAR FRONTEND CART STATE
        clearCart();

      } catch (error) {
        console.error(error);
      }
    }

    handleSuccess();

  }, []);

  return (
    <main className="payment-result-page">
      <section className="payment-result-card success">
        <h1>
          Payment Successful
        </h1>

        <p>
          Thank you for your purchase.
        </p>

        <p>
          Your order has been received successfully.
        </p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </section>
    </main>
  );
}

export default Success;