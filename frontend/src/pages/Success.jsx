import { Link } from "react-router-dom";

function Success() {
  return (
    <main className="payment-result-page">
      <section className="payment-result-card success">
        <h1>Payment Successful</h1>

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