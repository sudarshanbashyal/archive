import React from 'react';
import './profile.css';
import ProfileBlogs from './ProfileBlogs/ProfileBlogs';

const Profile = () => {
    return (
        <div className="profile">
            <div className="header-image"></div>

            <div className="content-container">
                <div className="profile">
                    <div className="profile-picture"></div>
                    <button className="follow-btn">Follow</button>
                </div>

                <div className="content">
                    <div className="profile-info">
                        <h1 className="user-name">Carson Turner</h1>
                        <p className="related-field">
                            Senior Engineer, Netflix
                        </p>

                        <div className="profile-stats">
                            <span className="follower-stat">
                                <strong>20</strong> Followers
                            </span>
                            <span className="blog-stat">
                                <strong>7</strong> Blogs
                            </span>
                            <span className="favourite-stat">
                                <strong>120</strong> Favourites
                            </span>
                        </div>
                    </div>

                    <hr />

                    <ProfileBlogs />
                </div>
            </div>
        </div>
    );
};

export default Profile;
