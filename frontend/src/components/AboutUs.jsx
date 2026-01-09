const AboutUs = () => {
  return (
    <section className="about-us" id="about">
      <div className="container about-container">
        {/* Header */}
        <div className="about-header">
          <h1>About Us</h1>
          <p>
            At Nepal FX, our mission is to provide accurate and up-to-date 
            foreign exchange rates for Nepal, helping businesses and individuals 
            make informed financial decisions.
          </p>
        </div>

        {/* Our Mission & Vision */}
        <div className="about-cards">
          <div className="card">
            <h3>Our Mission</h3>
            <p>
              Deliver reliable, real-time currency data for Nepal in a simple, 
              fast, and trustworthy platform.
            </p>
          </div>
          <div className="card">
            <h3>Our Vision</h3>
            <p>
              Become the go-to source for all foreign exchange information in Nepal, 
              empowering financial growth and transparency.
            </p>
          </div>
          <div className="card">
            <h3>Our Values</h3>
            <p>
              Accuracy, reliability, transparency, and user-friendly experience are 
              at the core of everything we do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
