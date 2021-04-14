import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

    // image preview states
    const [profilePreview, setProfilePreview] = useState<
        string | ArrayBuffer | null | undefined
    >();
    const [bannerPreview, setBannerPreview] = useState<
        string | ArrayBuffer | null | undefined
    >();

    const [profileImageError, setProfileImageError] = useState<
        string | null | undefined
    >();
    const [bannerImageError, setBannerImageError] = useState<
        string | null | undefined
    >();

    const profileUpload = useRef<any>(null);
    const bannerUpload = useRef<any>(null);

    // takes either profileUpload or bannerUpload reference object
    const openImageUploader = (uploader: React.MutableRefObject<any>) => {
        uploader.current!.click();
    };

    /**
     * Handles ImageUpload preview for both the profile and the banner.
     * @param previewState - Takes in useState object as the parameter. Determines which state it is that need to preview the image uploaded.
     * @param errorState -  Takes in useState object as the parameter. Determines which state it is that needs to hold the error returned by image uploader.
     */
    const handleFileInputChange = (
        e: any,
        previewState: React.Dispatch<
            React.SetStateAction<string | ArrayBuffer | null | undefined>
        >,
        errorState: React.Dispatch<
            React.SetStateAction<string | null | undefined>
        >
    ) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)) {
                errorState('THe uploaded file must be an image.');
                return;
            }
            if (file.size > 1000000) {
                errorState('The image must be under 1MB.');
                return;
            }
            previewImage(file, previewState);
        }
    };

    const previewImage = (
        file: Blob,
        previewState: React.Dispatch<
            React.SetStateAction<string | ArrayBuffer | null | undefined>
        >
    ) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            previewState(reader.result);
        };
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

            {/* profile image */}
            <div className="setting-section">
                <h2 className="section-title">your profile</h2>
                <p className="section-description">Profile Picture</p>
                <div className="profile-pictures">
                    <div
                        className="change-profile"
                        onClick={() => {
                            openImageUploader(profileUpload);
                        }}
                    >
                        <span>Click here to change your profile</span>
                    </div>
                    <input
                        type="file"
                        name="bannerImage"
                        ref={profileUpload}
                        style={{ display: 'none' }}
                        onChange={e => {
                            handleFileInputChange(
                                e,
                                setProfilePreview,
                                setProfileImageError
                            );
                        }}
                    />
                    <div className="profile"></div>
                </div>

                {/* header image */}
                <p className="section-description">Header Image</p>
                <div className="header-images">
                    <div
                        className="change-header"
                        onClick={() => {
                            openImageUploader(bannerUpload);
                        }}
                    >
                        Click here to change your header
                    </div>
                    <input
                        type="file"
                        name="bannerImage"
                        ref={bannerUpload}
                        style={{ display: 'none' }}
                    />
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
