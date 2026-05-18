import { Link } from "react-router-dom";

function Cancel() {
  return (
    <main className="payment-result-page">
      <section className="payment-result-card cancel">
        <h1>Payment Cancelled</h1>

        <p>
          Your checkout session was cancelled.
        </p>

        <p>
          No payment was processed.
        </p>

        <Link to="/cart">
          Return to Cart
        </Link>
      </section>
    </main>
  );
}

export default Cancel;