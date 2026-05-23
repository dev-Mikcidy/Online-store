import "../styles/Orders.css";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Orders() {
  const [products, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  useEffect(() => {
    async function fetchOrders(showLoading = false) {
      try {
        if (showLoading) {
          setIsLoading(true);
        }

        setErrorMessage("");
        let response;
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.role === "admin") {
          response = await fetch(`${API_URL}/api/orders`);
        } else {
          response = await fetch(`${API_URL}/api/orders/history`);
        }

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Could not load orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders(true);

    const interval = setInterval(() => {
      fetchOrders(false);
    }, 6000);

    return () => clearInterval(interval);
  }, [API_URL]);

  return (
    <main className="orders-page">
      <section className="orders-header">
        <h1>Order History</h1>

        <p>View your previous orders and purchases.</p>
      </section>

      <section className="orders-list">
        <div className="order-card">
          <div className="order-top">
            <h2>Order #10234</h2>

            <span className="order-status delivered">Delivered</span>
          </div>

          <p className="order-date">August 20, 2025</p>

          <div className="order-products">
            <p>iPhone 15 Pro × 1</p>

            <p>AirPods Pro × 2</p>
          </div>

          <h3 className="order-total">Total: 28,500 SEK</h3>
        </div>

        <div className="order-card">
          <div className="order-top">
            <h2>Order #10218</h2>

            <span className="order-status processing">Processing</span>
          </div>

          <p className="order-date">August 15, 2025</p>

          <div className="order-products">
            <p>MacBook Air M3 × 1</p>
          </div>

          <h3 className="order-total">Total: 16,999 SEK</h3>
        </div>
      </section>
    </main>
  );
}

export default Orders;
