import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

const Admin = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchAdminProducts();
  }, [navigate]);

  const fetchAdminProducts = async () => {
    const token = localStorage.getItem("token");

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.msg || "Could not load products");
        return;
      }

      setProducts(data);
    } catch (error) {
      setMessage("Could not connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/admin/product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.msg || "Could not delete product");
        return;
      }

      setProducts(products.filter((product) => product._id !== productId));
      setMessage("Product deleted successfully");
    } catch (error) {
      setMessage("Could not connect to server");
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage products in the store.</p>
      </section>

      {message && <p className="admin-message">{message}</p>}

      {isLoading ? (
        <p className="admin-status">Loading products...</p>
      ) : (
        <section className="admin-section">
          <h2>Products</h2>

          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          className="admin-product-image"
                          src={product.image}
                          alt={product.name}
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.price} SEK</td>
                      <td>{product.quantity}</td>
                      <td>
                        <button
                          className="admin-delete-button"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default Admin;
