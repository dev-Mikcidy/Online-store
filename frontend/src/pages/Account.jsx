import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Account.css";

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="account-container">
      <div className="account-card">
        <h1>My Account</h1>
        <p className="account-subtitle">Your account information</p>

        <div className="account-info">
          <div className="account-row">
            <span>First name</span>
            <strong>{user.firstname}</strong>
          </div>

          <div className="account-row">
            <span>Last name</span>
            <strong>{user.lastname}</strong>
          </div>

          <div className="account-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="account-row">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
