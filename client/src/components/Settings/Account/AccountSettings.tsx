import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from 'src/redux/store';
import './accountSettings.css';

const AccountSettings = () => {
    const userState = useSelector((state: RootStore) => state.client);
    const dispatch = useDispatch();

    const [accountData, setAccountData] = useState({
        email: userState.client?.profile.email,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [currentError, setCurrentError] = useState<null | string>(null);
    const [mismatchError, setMismatchError] = useState<null | string>(null);

    const handleChange = (e: any) => {
        setAccountData({
            ...accountData,
            [e.target.name]: e.target.value,
        });
    };

    const validateData = (e: React.FormEvent) => {
        e.preventDefault();

        if (!accountData.currentPassword) {
            setCurrentError(
                'You must enter the current password to confirm the changes.'
            );
        } else setCurrentError(null);

        if (accountData.newPassword.length < 6) {
            setMismatchError('Password must be at least 6 characters long.');
        } else if (accountData.newPassword !== accountData.confirmNewPassword) {
            setMismatchError('Your passwords do not match.');
        } else setMismatchError(null);

        handleSubmit();
    };

    const handleSubmit = () => {
        if (currentError === null && mismatchError === null) {
            console.log('W');
        }
    };

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
                        value={accountData.email}
                        id="email-input"
                        type="email"
                        name="email"
                        placeholder="Change Your Email Address"
                        onChange={handleChange}
                    />
                </form>
            </div>

            <div className="setting-section">
                <h2 className="section-title">password</h2>
                <form onSubmit={validateData}>
                    <label
                        htmlFor="current-password-input"
                        className="section-description"
                    >
                        Current Password
                    </label>
                    <input
                        id="current-password-input"
                        type="password"
                        name="currentPassword"
                        placeholder="Your Current Password"
                        onChange={handleChange}
                    />

                    <p className="error-message">{currentError}</p>

                    <label
                        htmlFor="new-password-input"
                        className="section-description"
                    >
                        New Password
                    </label>
                    <input
                        id="new-password-input"
                        type="password"
                        name="newPassword"
                        placeholder="Your New Password"
                        onChange={handleChange}
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
                        name="confirmNewPassword"
                        placeholder="Your New Password"
                        onChange={handleChange}
                    />
                    <p className="error-message">{mismatchError}</p>

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
