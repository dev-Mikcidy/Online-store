import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  const emptyForm = {
    name: "",
    model: "",
    category: "Phone",
    description: "",
    image: "",
    price: "",
    quantity: "",
    ram: "",
    ssd: "",
  };

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);

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

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const fetchAdminProducts = async () => {
    const token = localStorage.getItem("token");

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.msg || "Could not load products", "error");
        return;
      }

      setProducts(data);
    } catch (error) {
      showMessage("Could not connect to server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProductId(null);
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);

    setFormData({
      name: product.name || "",
      model: product.model || "",
      category: product.category || "Phone",
      description: product.description || "",
      image: product.image || "",
      price: product.price || "",
      quantity: product.quantity || "",
      ram: product.specifications?.ram || "",
      ssd: product.specifications?.ssd || "",
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    const productData = {
      name: formData.name,
      model: formData.model,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      specifications: {
        ram: formData.ram,
        ssd: formData.ssd,
      },
    };

    const isEditing = Boolean(editingProductId);
    const url = isEditing
      ? `${API_URL}/admin/product/${editingProductId}`
      : `${API_URL}/admin/product`;

    const method = isEditing ? "PUT" : "POST";

    try {
      setMessage("");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.msg || "Could not save product", "error");
        return;
      }

      if (isEditing) {
        setProducts(
          products.map((product) =>
            product._id === editingProductId ? data.product : product
          )
        );
        showMessage("Product updated successfully", "success");
      } else {
        setProducts([data.product, ...products]);
        showMessage("Product added successfully", "success");
      }

      resetForm();
    } catch (error) {
      showMessage("Could not connect to server", "error");
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/admin/product/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.msg || "Could not delete product", "error");
        return;
      }

      setProducts(products.filter((product) => product._id !== productId));
      showMessage("Product deleted successfully", "success");

      if (editingProductId === productId) {
        resetForm();
      }
    } catch (error) {
      showMessage("Could not connect to server", "error");
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage products in the store.</p>
      </section>

      {message && <p className={`admin-message ${messageType}`}>{message}</p>}

      <section className="admin-section">
        <h2>{editingProductId ? "Edit Product" : "Add Product"}</h2>

        <form className="admin-form" onSubmit={handleSubmitProduct}>
          <input type="text" name="name" placeholder="Product name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="model" placeholder="Model" value={formData.model} onChange={handleChange} required />

          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="Phone">Phone</option>
            <option value="Laptop">Laptop</option>
            <option value="Television">Television</option>
            <option value="Accessories">Accessories</option>
          </select>

          <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
          <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} min="0" required />
          <input type="text" name="ram" placeholder="RAM" value={formData.ram} onChange={handleChange} />
          <input type="text" name="ssd" placeholder="SSD / Storage" value={formData.ssd} onChange={handleChange} />

          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

          <button type="submit" className="admin-add-button">
            {editingProductId ? "Save Changes" : "Add Product"}
          </button>

          {editingProductId && (
            <button type="button" className="admin-cancel-button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </form>
      </section>

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
                        <img className="admin-product-image" src={product.image} alt={product.name} />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.price} SEK</td>
                      <td>{product.quantity}</td>
                      <td>
                        <div className="admin-action-buttons">
                          <button className="admin-edit-button" onClick={() => handleEditClick(product)}>
                            Edit
                          </button>

                          <button className="admin-delete-button" onClick={() => handleDeleteProduct(product._id)}>
                            Delete
                          </button>
                        </div>
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
