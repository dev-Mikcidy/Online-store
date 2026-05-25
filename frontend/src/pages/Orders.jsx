import "../styles/Orders.css";
import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
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

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          throw new Error("User not found");
        }

        let response;

        if (user.role === "admin") {
          response = await fetch(`${API_URL}/api/orders/all`);
        } else {
          response = await fetch(`${API_URL}/api/orders/${user.id}`);
        }

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const ordersData = await response.json();

        setOrders(ordersData);

        // Fetch all product details
        const uniqueProductIds = [
          ...new Set(
            ordersData.flatMap((order) =>
              order.products.map((product) => product.productId),
            ),
          ),
        ];

        const productRequests = uniqueProductIds.map(async (productId) => {
          try {
            const productResponse = await fetch(
              `${API_URL}/api/products/${productId}`,
            );

            if (!productResponse.ok) {
              throw new Error("Failed to fetch product");
            }

            const productData = await productResponse.json();

            return {
              id: productId,
              data: productData,
            };
          } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);

            return null;
          }
        });

        const fetchedProducts = await Promise.all(productRequests);

        const productsObject = {};

        fetchedProducts.forEach((product) => {
          if (product) {
            productsObject[product.id] = product.data;
          }
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
    }, 10000);

    return () => clearInterval(interval);
  }, [API_URL]);

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
        <h1>Order History</h1>

        <p>View your previous orders and purchases.</p>
      </section>

      <section className="orders-list">
        {orders.length === 0 ? (
          <p className="empty-orders">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-top">
                <h2>Order #{order._id}</h2>

                <span className={`order-status ${order.status?.toLowerCase()}`}>
                  {order.status}
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
          ))
        )}
      </section>
    </main>
  );
}

export default Orders;
