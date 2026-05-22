import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // HANDLES INPUT CHANGES
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    // PASSWORD CHECK
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:3001";

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: formData.firstName,
            lastname: formData.lastName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
          }),
        }
      );

      const data = await response.json();

      // ERROR HANDLING
      if (!response.ok) {
        throw new Error(
          data.message ||
          data.msg ||
          "Signup failed"
        );
      }

      // SAVE USER DATA
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Signup successful!");

      // REDIRECT TO HOME
      navigate("/");

    } catch (error) {
      console.error(error);

      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <form
        className="signup-form"
        onSubmit={handleSubmit}
      >
        <h1>Create Account</h1>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="signup-input"
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="signup-input"
          required
        />

        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="signup-input"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="signup-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="signup-input"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="signup-input"
          required
        />

        <button
          type="submit"
          className="signup-button"
        >
          Sign Up
        </button>

        <p className="signup-text">
          Already have an account?{" "}
          <Link
            to="/login"
            className="signup-link"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;