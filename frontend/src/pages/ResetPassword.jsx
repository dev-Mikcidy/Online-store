import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.msg || "Password reset failed");
        return;
      }

      setSuccess(true);
      setMessage("Password reset successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage("Could not connect to server");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleResetPassword}>
        <h1>Reset Password</h1>

        {message && (
          <p className={success ? "login-success" : "login-message"}>
            {message}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="login-input"
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={formData.newPassword}
          onChange={handleChange}
          className="login-input"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="login-input"
          minLength="6"
          required
        />

        <button type="submit" className="login-button">
          Reset Password
        </button>

        <p className="login-text">
          Remember your password?{" "}
          <Link to="/login" className="login-link">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
