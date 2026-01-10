import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">

        {/* Left Section */}
        <div className="contact-info">
          <h2>Contact Us</h2>
          <p>
            Have questions or need support?  
            Feel free to reach out to us anytime.
          </p>

          <div className="info-item">
            <span>Email</span>
            <p>support@travelapp.com</p>
          </div>

          <div className="info-item">
            <span>Phone</span>
            <p>+91 93531 98519</p>
          </div>

          <div className="info-item">
            <span>Location</span>
            <p>Karnataka, India</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="contact-form">
          <h3>Send Message</h3>

          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required />
            <button type="submit">Send Message</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
