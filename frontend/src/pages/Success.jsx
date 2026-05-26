import { useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Success() {
  const { clearCart } = useContext(CartContext);
  const hasClearedCart = useRef(false);

  useEffect(() => {
    async function handleSuccess() {
      if (hasClearedCart.current) {
        return;
      }

      hasClearedCart.current = true;

      try {
        await clearCart();
      } catch (error) {
        console.error(error);
      }
    }

    handleSuccess();
  }, []);

  return (
    <main className="payment-result-page">
      <section className="payment-result-card success">
        <h1>Payment Successful</h1>

        <p>Thank you for your purchase.</p>

        <p>Your order has been received successfully.</p>

        <Link to="/products">Continue Shopping</Link>
      </section>
    </main>
  );
}

export default Success;
