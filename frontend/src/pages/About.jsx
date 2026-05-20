import "../styles/About.css";

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About Our Project</h1>

        <section className="about-section">
          <h2>Team Name</h2>

          <p>TechStore Team</p>
        </section>

        <section className="about-section">
          <h2>Project Description</h2>

          <p>
            We are building an electronics online store where users
            can browse products, create accounts, and purchase
            devices online.
          </p>
        </section>

        <section className="about-section">
          <h2>Team Members</h2>

          <ul className="team-list">
            <li>
              <strong>Anastasia Klimson</strong> — Project setup,
              homepage, frontend layout
            </li>

            <li>
              <strong>Lungowe Akushanga</strong> — Login,
              signup, about page
            </li>

            <li>
              <strong>Michael Agunbiade</strong> — Authentication,
              user roles, admin backend
            </li>

            <li>
              <strong>Maraizu Dominic-Judes</strong> — Backend
              product API and MongoDB
            </li>

            <li>
              <strong>Uchenna Peter Enyinnah</strong> — Products
              page and product details
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default About;