import React from 'react';
import './profileSettings.css';

const ProfileSettings = () => {
    return (
        <div className="profile-settings">
            <div className="setting-section">
                <h2 className="section-title">theme</h2>
                <p className="section-description">
                    Select a theme for you application. Your preference will be
                    saved automatically.
                </p>

                <div className="themes">
                    <div className="theme light-theme">
                        <span>Light</span>
                    </div>
                    <div className="theme dark-theme">
                        <span>Dark</span>
                    </div>
                    <div className="theme high-contrast">
                        <span>High Contrast</span>
                    </div>
                </div>
            </div>

            <div className="setting-section">
                <h2 className="section-title">your profile</h2>
                <p className="section-description">Profile Picture</p>
                <div className="profile-pictures">
                    <div className="change-profile">
                        <span>Click here to change your profile</span>
                    </div>
                    <div className="profile"></div>
                </div>

                <p className="section-description">Header Image</p>
                <div className="header-images">
                    <div className="change-header">
                        Click here to change your header
                    </div>
                    <div className="header"></div>
                </div>
            </div>

            <div className="setting-section">
                <h2 className="section-title">about you</h2>

                <form>
                    <label htmlFor="name-input" className="section-description">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="name-input"
                        placeholder="Your First Name"
                    />

                    <label
                        htmlFor="last-name-input"
                        className="section-description"
                    >
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="last-name-input"
                        placeholder="Your Last Name"
                    />

                    <label
                        htmlFor="interest-input"
                        className="section-description"
                    >
                        Interest/ Workplace/ Education
                    </label>
                    <input
                        type="text"
                        id="interest-input"
                        placeholder="What do you do?/ What are you interested i?"
                    />

                    <label htmlFor="bio-input" className="section-description">
                        Bio
                    </label>
                    <textarea
                        className="bio-input"
                        id=""
                        cols={30}
                        rows={5}
                        placeholder="Write something about yourself"
                    ></textarea>

                    <button className="save-btn">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
