import React from "react";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile-page">
      <div className="profile-card">
        
        {/* Profile Header */}
        <div className="profile-header">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="profile-avatar"
          />
          <h2 className="profile-name">Pradeep Kumar</h2>
          <p className="profile-role">Full Stack Developer</p>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="detail-item">
            <span>Email</span>
            <p>pradeepk9348@gmail.com</p>
          </div>
          <div className="detail-item">
            <span>Phone</span>
            <p>+91 93531 98519</p>
          </div>
          <div className="detail-item">
            <span>Location</span>
            <p>Karnataka, India</p>
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button className="btn primary">Edit Profile</button>
          <button className="btn outline">Logout</button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
