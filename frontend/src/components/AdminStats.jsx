import "../styles/AdminStats.css";

function AdminStats({ orders }) {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  const totalOrders = orders.length;

  return (
    <section className="admin-stats">
      <h2>Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>{totalRevenue.toFixed(2)} SEK</p>
        </div>
      </div>
    </section>
  );
}

export default AdminStats;