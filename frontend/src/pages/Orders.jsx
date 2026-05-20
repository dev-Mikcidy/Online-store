import "../styles/Orders.css";

function Orders() {
  return (
    <main className="orders-page">
      <section className="orders-header">
        <h1>Order History</h1>

        <p>
          View your previous orders and purchases.
        </p>
      </section>

      <section className="orders-list">
        <div className="order-card">
          <div className="order-top">
            <h2>Order #10234</h2>

            <span className="order-status delivered">
              Delivered
            </span>
          </div>

          <p className="order-date">
            August 20, 2025
          </p>

          <div className="order-products">
            <p>iPhone 15 Pro × 1</p>

            <p>AirPods Pro × 2</p>
          </div>

          <h3 className="order-total">
            Total: 28,500 SEK
          </h3>
        </div>

        <div className="order-card">
          <div className="order-top">
            <h2>Order #10218</h2>

            <span className="order-status processing">
              Processing
            </span>
          </div>

          <p className="order-date">
            August 15, 2025
          </p>

          <div className="order-products">
            <p>MacBook Air M3 × 1</p>
          </div>

          <h3 className="order-total">
            Total: 16,999 SEK
          </h3>
        </div>
      </section>
    </main>
  );
}

export default Orders;