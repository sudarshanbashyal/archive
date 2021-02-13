import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUserProfile } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import './profileSettings.css';

const ProfileSettings = () => {
    const userState = useSelector((state: RootStore) => state.client);
    const dispatch = useDispatch();

    // extract the profile information from redux state
    const accessToken = userState && userState.client?.accessToken;
    const profile = userState && userState.client!.profile;
    const [profileData, setProfileData] = useState({
        firstName: profile.firstName,
        lastName: profile.lastName,
        interest: profile.interest,
        workplace: profile.workplace,
        bio: profile.bio,
    });

    const handleChange = (e: any) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateUserProfile(profileData, accessToken!));
    };

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

                <form onSubmit={handleSubmit}>
                    <label htmlFor="name-input" className="section-description">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="name-input"
                        placeholder="Your First Name"
                        value={profileData.firstName}
                        name="firstName"
                        onChange={handleChange}
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
                        value={profileData.lastName}
                        name="lastName"
                        onChange={handleChange}
                    />

                    <label
                        htmlFor="interest-input"
                        className="section-description"
                    >
                        Interest/ Education
                    </label>
                    <input
                        type="text"
                        id="interest-input"
                        placeholder="What do you do?/ What are you interested in?"
                        value={profileData.interest}
                        name="interest"
                        onChange={handleChange}
                    />

                    <label
                        htmlFor="workplace-input"
                        className="section-description"
                    >
                        Workplace
                    </label>
                    <input
                        type="text"
                        id="interest-input"
                        placeholder="Where do you work?"
                        value={profileData.workplace}
                        name="workplace"
                        onChange={handleChange}
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
                        value={profileData.bio}
                        name="bio"
                        onChange={handleChange}
                    ></textarea>
                    <p
                        style={{
                            color:
                                profileData.bio.length >= 200
                                    ? '#dd3b40'
                                    : 'black',
                        }}
                        className="bio-length"
                    >
                        {profileData.bio.length}/200
                    </p>

                    <button
                        className="save-btn"
                        disabled={profileData.bio.length > 200}
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
