import React from 'react';
import './accountSettings.css';

const AccountSettings = () => {
    return (
        <div className="account-setting">
            <div className="setting-section">
                <h2 className="section-title">account</h2>
                <form>
                    <label
                        htmlFor="email-input"
                        className="section-description"
                    >
                        Email Address
                    </label>
                    <input
                        id="email-input"
                        type="email"
                        placeholder="Your Email Address"
                    />
                </form>
            </div>

            <div className="setting-section">
                <h2 className="section-title">password</h2>
                <form>
                    <label
                        htmlFor="current-password-input"
                        className="section-description"
                    >
                        Current Password
                    </label>
                    <input
                        id="current-password-input"
                        type="password"
                        placeholder="Your Current Password"
                    />

                    <label
                        htmlFor="new-password-input"
                        className="section-description"
                    >
                        New Password
                    </label>
                    <input
                        id="new-password-input"
                        type="password"
                        placeholder="Your Current Password"
                    />

                    <label
                        htmlFor="confirm-password-input"
                        className="section-description"
                    >
                        Confirm New Password
                    </label>
                    <input
                        id="confirm-password-input"
                        type="password"
                        placeholder="Your Current Password"
                    />

                    <button className="save-btn">Save Changes</button>
                </form>
            </div>

            <div className="setting-section">
                <p className="section-description danger-title">
                    Delete Account
                </p>
                <p>This will delete your account permanently.</p>
                <form>
                    <button className="delete-btn">Delete Account</button>
                </form>
            </div>
        </div>
    );
};

export default AccountSettings;
