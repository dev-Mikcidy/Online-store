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
            TechStore is a fullstack electronics online store where
            users can browse products, view detailed product information,
            add items to the cart and complete purchases using Stripe 
            checkout. Users can also create accounts, log in, view their 
            account information and see their order history. The application
            also includes an admin dashboard where admins can manage products 
            and view store statistics.
          </p>
        </section>

        <section className="about-section">
          <h2>Team Members</h2>

          <ul className="team-list">
            <li>
              <strong>Anastasia Klimson</strong> — Frontend: Project setup,
              Products page, Product Details page, Admin products section,
              Account page, UI styling
            </li>

            <li>
              <strong>Lungowe Akushanga</strong> — Frontend: Homepage, Navbar,
              Cart page, Login page, Admin overview/statistics section
            </li>

            <li>
              <strong>Michael Agunbiade</strong> — Backend/Deployment: 
              Login and signup authentication, Render/Vercel deployment
            </li>

            <li>
              <strong>Maraizu Dominic-Judes</strong> — Backend: Database setup,
              Stripe payment integration, product and order REST APIs
            </li>

            <li>
              <strong>Uchenna Peter Enyinnah</strong> — Frontend: About page,
              Footer, Orders page, Signup page
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default About;