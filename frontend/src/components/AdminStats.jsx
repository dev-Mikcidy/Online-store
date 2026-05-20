import "../styles/AdminStats.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminStats({ orders = [] }) {
  const safeOrders = Array.isArray(orders) ? orders : [];

  const now = new Date();

  // Last 7 days orders
  const last7DaysOrders = safeOrders.filter((order) => {
    if (!order?.timeCreated) return false;

    const orderDate = new Date(order.timeCreated);

    const diffTime = now - orderDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 7;
  });

  // Total revenue
  const totalRevenue = safeOrders.reduce(
    (sum, order) => sum + (order?.totalPrice || 0),
    0
  );

  // Total orders
  const totalOrders = safeOrders.length;

  // Build labels for last 7 days
  const last7Labels = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();

    d.setDate(d.getDate() - i);

    const formattedDate = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });

    last7Labels.push(formattedDate);
  }

  // Count orders per day
  const ordersPerDay = {};

  last7DaysOrders.forEach((order) => {
    const formattedDate = new Date(
      order.timeCreated
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });

    ordersPerDay[formattedDate] =
      (ordersPerDay[formattedDate] || 0) + 1;
  });

  // Chart data
  const chartData = last7Labels.map((date) => ({
    date,
    orders: ordersPerDay[date] || 0,
  }));

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

        <div className="stat-card">
          <h3>Orders Last 7 Days</h3>
          <p>{last7DaysOrders.length}</p>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Orders Per Day</h3>
          <span>Last 7 Days</span>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="4 4" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="orders"
              stroke="#111827"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default AdminStats;