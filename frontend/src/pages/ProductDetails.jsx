import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import "../styles/ProductDetails.css";

import { CartContext }
from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } =
    useContext(CartContext);

  const [product, setProduct] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3001";

  useEffect(() => {
    async function fetchProductDetails(
      showLoading = false
    ) {
      try {
        if (showLoading) {
          setIsLoading(true);
        }

        setErrorMessage("");

        const response = await fetch(
          `${API_URL}/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch product details"
          );
        }

        const data =
          await response.json();

        if (!data) {
          setErrorMessage(
            "Product not found."
          );

          return;
        }

        setProduct(data);

      } catch (error) {
        console.error(error);

        setErrorMessage(
          "Could not load product details. Please try again later."
        );

      } finally {
        setIsLoading(false);
      }
    }

    fetchProductDetails(true);

    const interval = setInterval(() => {
      fetchProductDetails(false);
    }, 6000);

    return () =>
      clearInterval(interval);

  }, [API_URL, id]);

  // UPDATED
  const handleAddToCart =
    async () => {
      if (
        !product ||
        product.quantity <= 0
      ) {
        return;
      }

      await addToCart(product._id);

      navigate("/cart");
    };

  if (isLoading) {
    return (
      <main className="product-details-page">
        <p className="product-details-status">
          Loading product details...
        </p>
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="product-details-page">
        <section className="product-not-found">
          <h1>Product not found</h1>

          <p>
            {errorMessage ||
              "The product you are looking for does not exist."}
          </p>

          <Link
            className="details-button primary-button"
            to="/products"
          >
            Back to products
          </Link>
        </section>
      </main>
    );
  }

  const isOutOfStock =
    product.quantity <= 0;

  return (
    <main className="product-details-page">
      <section className="product-details-card">
        <div className="product-details-image">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
            />
          ) : (
            "Product Image"
          )}
        </div>

        <div className="product-details-info">
          <p className="product-details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-model">
            Model: {product.model}
          </p>

          <p className="product-details-price">
            {product.price} SEK
          </p>

          <p
            className={
              product.quantity > 0
                ? "product-details-stock in-stock"
                : "product-details-stock out-of-stock"
            }
          >
            {product.quantity > 0
              ? `${product.quantity} in stock`
              : "Out of stock"}
          </p>

          <p className="product-details-description">
            {product.description}
          </p>

          {product.specifications && (
            <div className="product-specifications">
              <h2>Specifications</h2>

              <ul>
                <li>
                  RAM:{" "}
                  {product.specifications.ram}
                </li>

                <li>
                  SSD:{" "}
                  {product.specifications.ssd}
                </li>
              </ul>
            </div>
          )}

          <div className="product-details-actions">
            <button
              className={
                isOutOfStock
                  ? "details-button disabled-button"
                  : "details-button primary-button"
              }
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock
                ? "Out of stock"
                : "Add to cart"}
            </button>

            <Link
              className="details-button secondary-button"
              to="/products"
            >
              Back to products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;