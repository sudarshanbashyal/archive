import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAccount } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import './accountSettings.css';

const AccountSettings = () => {
    const userState = useSelector((state: RootStore) => state.client);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );
    const dispatch = useDispatch();

    const emailFormat =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const [accountData, setAccountData] = useState({
        email: userState.client?.profile.email,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [currentError, setCurrentError] = useState<null | string>(null);
    const [mismatchError, setMismatchError] = useState<null | string>(null);
    const [emailError, setEmailError] = useState<null | string>(null);

    const handleChange = (e: any) => {
        setAccountData({
            ...accountData,
            [e.target.name]: e.target.value,
        });
    };

    const validateData = (e: React.FormEvent): void => {
        e.preventDefault();

        if (accountData.newPassword || accountData.confirmNewPassword) {
            if (accountData.newPassword !== accountData.confirmNewPassword) {
                setMismatchError('Your passwords do not match.');
            } else if (accountData.newPassword.length < 6) {
                setMismatchError(
                    'Your password must be at least 6 characters long.'
                );
            } else if (!accountData.currentPassword) {
                setCurrentError(
                    'You must enter the current password to confirm the changes'
                );
            } else if (!accountData.email?.match(emailFormat)) {
                setEmailError('Please enter a valid email address.');
            } else {
                handleSubmit();
                setCurrentError(null);
                setMismatchError(null);
            }
        } else {
            if (!accountData.currentPassword) {
                setCurrentError(
                    'You must enter the current password to confirm the changes'
                );
            } else if (!accountData.email?.match(emailFormat)) {
                setEmailError('Please enter a valid email address.');
            } else {
                handleSubmit();
            }
        }
    };

    const handleSubmit = () => {
        setMismatchError(null);
        setCurrentError(null);
        setEmailError(null);
        dispatch(
            updateUserAccount(
                accountData,
                userState && userState.client?.accessToken
            )
        );
    };

    return (
        <div
            className={
                'account-setting ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'account-setting-dark'
                    : '')
            }
        >
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
                        style={{
                            marginBottom: emailError ? '20px' : '0px',
                        }}
                        value={accountData.email}
                        id="email-input"
                        type="email"
                        name="email"
                        placeholder="Change Your Email Address"
                        onChange={handleChange}
                    />
                    <p className="error-message">{emailError && emailError}</p>
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
