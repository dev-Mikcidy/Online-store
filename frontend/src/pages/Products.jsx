import { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import "../styles/Products.css";
import { CartContext } from "../context/CartContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const { addToCart } = useContext(CartContext);

  const [searchParams, setSearchParams] =
    useSearchParams();

  const selectedCategory =
    searchParams.get("category");

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3001";

  const categories = [
    { label: "All", value: "" },
    { label: "Phones", value: "Phone" },
    { label: "Laptops", value: "Laptop" },
    { label: "TVs", value: "Television" },
    { label: "Accessories", value: "Accessories" },
  ];

  useEffect(() => {
    async function fetchProducts(
      showLoading = false
    ) {
      try {
        if (showLoading) {
          setIsLoading(true);
        }

        setErrorMessage("");

        const response = await fetch(
          `${API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data =
          await response.json();

        setProducts(data);

      } catch (error) {
        console.error(error);

        setErrorMessage(
          "Could not load products. Please try again later."
        );

      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts(true);

    const interval = setInterval(() => {
      fetchProducts(false);
    }, 6000);

    return () =>
      clearInterval(interval);

  }, [API_URL]);

  const handleCategoryChange = (
    category
  ) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  // UPDATED
  const handleAddToCart = async (
    product
  ) => {
    if (product.quantity <= 0) {
      return;
    }

    await addToCart(product._id);
  };

  const filteredProducts =
    products.filter((product) => {
      const searchValue =
        searchTerm.toLowerCase();

      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.model
          ?.toLowerCase()
          .includes(searchValue) ||
        product.description
          ?.toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        selectedCategory
          ? product.category ===
            selectedCategory
          : true;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  const sortedProducts = [
    ...filteredProducts,
  ].sort((a, b) => {
    if (sortOption === "price-low") {
      return a.price - b.price;
    }

    if (sortOption === "price-high") {
      return b.price - a.price;
    }

    if (sortOption === "name-az") {
      return a.name.localeCompare(
        b.name
      );
    }

    return 0;
  });

  return (
    <main className="products-page">
      <section className="products-header">
        <h1>Products</h1>

        <p>
          Browse our available products.
        </p>

        <input
          className="products-search"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value
            )
          }
        />

        <div className="category-filter">
          {categories.map(
            (category) => (
              <button
                key={category.label}
                className={
                  selectedCategory ===
                    category.value ||
                  (!selectedCategory &&
                    category.value ===
                      "")
                    ? "category-filter-button active"
                    : "category-filter-button"
                }
                onClick={() =>
                  handleCategoryChange(
                    category.value
                  )
                }
              >
                {category.label}
              </button>
            )
          )}
        </div>

        <div className="sort-control">
          <label htmlFor="sort-products">
            Sort by:
          </label>

          <select
            id="sort-products"
            value={sortOption}
            onChange={(event) =>
              setSortOption(
                event.target.value
              )
            }
          >
            <option value="default">
              Default
            </option>

            <option value="price-low">
              Price: low to high
            </option>

            <option value="price-high">
              Price: high to low
            </option>

            <option value="name-az">
              Name: A-Z
            </option>
          </select>
        </div>
      </section>

      {isLoading && (
        <p className="products-status">
          Loading products...
        </p>
      )}

      {errorMessage && (
        <p className="products-status error">
          {errorMessage}
        </p>
      )}

      {!isLoading &&
        !errorMessage &&
        sortedProducts.length === 0 && (
          <p className="no-products-message">
            No products found.
          </p>
        )}

      {!isLoading &&
        !errorMessage &&
        sortedProducts.length > 0 && (
          <section className="products-list">
            {sortedProducts.map(
              (product) => {
                const isOutOfStock =
                  product.quantity <= 0;

                return (
                  <div
                    className="product-item"
                    key={product._id}
                  >
                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src =
                          "https://images.pexels.com/photos/159643/laptop-ipad-organic-natural-159643.jpeg";
                      }}
                    />

                    <div className="product-info">
                      <p className="product-category">
                        {product.category}
                      </p>

                      <h2>
                        {product.name}
                      </h2>

                      <p className="product-model">
                        Model:{" "}
                        {product.model}
                      </p>

                      <p className="product-description">
                        {
                          product.description
                        }
                      </p>

                      <p className="product-price">
                        {product.price} SEK
                      </p>

                      <p
                        className={
                          product.quantity >
                          0
                            ? "product-stock in-stock"
                            : "product-stock out-of-stock"
                        }
                      >
                        {product.quantity >
                        0
                          ? `${product.quantity} in stock`
                          : "Out of stock"}
                      </p>

                      <div className="product-buttons">
                        <Link
                          className="product-button"
                          to={`/products/${product._id}`}
                        >
                          View product
                        </Link>

                        <button
                          className={
                            isOutOfStock
                              ? "cart-button disabled-cart-button"
                              : "cart-button"
                          }
                          onClick={() =>
                            handleAddToCart(
                              product
                            )
                          }
                          disabled={
                            isOutOfStock
                          }
                        >
                          {isOutOfStock
                            ? "Out of stock"
                            : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </section>
        )}
    </main>
  );
}

export default Products;