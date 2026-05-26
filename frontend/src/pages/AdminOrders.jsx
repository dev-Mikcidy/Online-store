import "../styles/Orders.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchOrderId, setSearchOrderId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/orders");
      return;
    }

    async function fetchOrders(showLoading = false) {
      try {
        if (showLoading) setIsLoading(true);
        setErrorMessage("");

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/admin/orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch orders");

        const ordersData = await response.json();
        setOrders(ordersData);

        const uniqueProductIds = [
          ...new Set(
            ordersData.flatMap((order) =>
              order.products.map((product) => product.productId)
            )
          ),
        ];

        const productRequests = uniqueProductIds.map(async (productId) => {
          try {
            const productResponse = await fetch(
              `${API_URL}/api/products/${productId}`
            );

            if (!productResponse.ok) throw new Error("Failed to fetch product");

            const productData = await productResponse.json();

            return { id: productId, data: productData };
          } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
          }
        });

        const fetchedProducts = await Promise.all(productRequests);

        const productsObject = {};
        fetchedProducts.forEach((product) => {
          if (product) productsObject[product.id] = product.data;
        });

        setProductsMap(productsObject);
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
    }, 8000);

    return () => clearInterval(interval);
  }, [API_URL, navigate]);

  const filteredOrders = orders.filter((order) => {
    const orderId = order._id?.toLowerCase() || "";
    const orderStatus = order.status?.toLowerCase() || "unknown";

    const matchesSearch = orderId.includes(searchOrderId.toLowerCase().trim());
    const matchesStatus = statusFilter === "all" || orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <main className="orders-page">
        <p className="loading-message">Loading orders...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="orders-page">
        <p className="error-message">{errorMessage}</p>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <section className="orders-header">
        <h1>All Orders</h1>
        <p>Manage and review all customer orders.</p>
      </section>

      <section className="orders-controls">
        <input
          type="text"
          className="orders-search"
          placeholder="Search by order ID..."
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
        />

        <div className="orders-status-buttons">
          <button
            type="button"
            className={`orders-status-button ${
              statusFilter === "all" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>

          <button
            type="button"
            className={`orders-status-button ${
              statusFilter === "paid" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("paid")}
          >
            Paid
          </button>

          <button
            type="button"
            className={`orders-status-button ${
              statusFilter === "pending" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </button>

          <button
            type="button"
            className={`orders-status-button ${
              statusFilter === "failed" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("failed")}
          >
            Failed
          </button>

          <button
            type="button"
            className={`orders-status-button ${
              statusFilter === "cancelled" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>
      </section>

      <section className="orders-list">
        {filteredOrders.length === 0 ? (
          <p className="empty-orders">No orders found.</p>
        ) : (
          filteredOrders.map((order) => {
            const statusClass = order.status?.toLowerCase() || "unknown";

            return (
              <div className="order-card" key={order._id}>
                <div className="order-top">
                  <h2>Order #{order._id}</h2>

                  <span className={`order-status ${statusClass}`}>
                    {order.status || "Unknown"}
                  </span>
                </div>

                <p className="order-date">
                  {new Date(order.timeCreated).toLocaleString()}
                </p>

                <div className="order-products">
                  {order.products.map((product) => {
                    const productData = productsMap[product.productId];

                    return (
                      <div className="order-product-item" key={product.productId}>
                        {productData?.image && (
                          <img
                            src={productData.image}
                            alt={productData.name}
                            className="order-product-image"
                          />
                        )}

                        <div className="order-product-details">
                          <p>
                            <strong>Product Name:</strong>{" "}
                            {productData?.name || "Unknown Product"}
                          </p>

                          <p>
                            <strong>Product Model:</strong>{" "}
                            {productData?.model || "N/A"}
                          </p>

                          <p>
                            <strong>Product Category:</strong>{" "}
                            {productData?.category || "N/A"}
                          </p>

                          <p>
                            <strong>Quantity:</strong> {product.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h3 className="order-total">Total: {order.totalPrice} SEK</h3>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}

export default AdminOrders;