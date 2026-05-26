import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import "../styles/Navbar.css";

import { CartContext } from "../context/CartContext";

import { FaShoppingCart } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // UPDATED CART
  const { cart, setCart } =
    useContext(CartContext);

  const totalItems = cart.totalQuantity;

  const loadUser = () => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, []);

  // UPDATED LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    // CLEAR FRONTEND CART
    setCart({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    });

    setUser(null);

    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          Electronics Store
        </Link>
      </div>

      <nav className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/about">
          About
        </Link>

        <Link
          to="/cart"
          className="cart-link"
        >
          <FaShoppingCart />

          <span>Cart</span>

          {totalItems > 0 && (
            <span className="cart-badge">
              {totalItems}
            </span>
          )}
        </Link>

        {user?.role === "admin" && (
          <Link to="/admin">
            Admin
          </Link>
        )}

        {user ? (
          <div className="navbar-auth">
            <Link
              to="/orders"
              className="orders-link"
            >
              Orders
            </Link>

            <Link
              to="/account"
              className="navbar-user"
            >
              Hi, {user.firstname}
            </Link>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link
              to="/login"
              className="login-nav-link"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="signup-nav-button"
            >
              Sign up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;