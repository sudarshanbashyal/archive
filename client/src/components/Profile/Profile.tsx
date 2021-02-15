import React, { useEffect, useState } from 'react';
import { couldStartTrivia } from 'typescript';
import './profile.css';
import ProfileBlogs from './ProfileBlogs/ProfileBlogs';

interface ProfileInfoType {
    firstName: string;
    lastName: string;
    interest: string;
    workplace: string;
}

export interface ProfileBlogType {
    blogId: number;
    title: string;
    createdAt: Date;
    headerImage: string;
    topicTitle: string;
}

const Profile = (props: any) => {
    const { id: profileId } = props.match.params;

    const [userExists, setUserExists] = useState<boolean>(true);
    const [profileInfo, setProfileInfo] = useState<ProfileInfoType>({
        firstName: '',
        lastName: '',
        interest: '',
        workplace: '',
    });
    const [profileBlogs, setProfileBlogs] = useState<ProfileBlogType[]>([]);

    useEffect(() => {
        (async function () {
            const res = await fetch(`/user/getUser/${profileId}`);
            const data = await res.json();

            if (data.ok) {
                console.log(data.info);
                // set up profile info
                let {
                    first_name,
                    last_name,
                    interest,
                    workplace,
                } = data.info[0];
                setProfileInfo({
                    firstName: first_name,
                    lastName: last_name,
                    interest,
                    workplace,
                });

                // retrieve all the blogs
                const retrievedBlogs = data.info.map(
                    (blog: any): ProfileBlogType => {
                        const {
                            blog_id: blogId,
                            title,
                            created_at: createdAt,
                            header_image: headerImage,
                            topic_title: topicTitle,
                        } = blog;

                        return {
                            blogId,
                            title,
                            createdAt,
                            headerImage,
                            topicTitle,
                        };
                    }
                );

                setProfileBlogs([...profileBlogs, ...retrievedBlogs]);
                console.log(profileBlogs);
            } else {
                setUserExists(false);
            }
        })();
    }, []);

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
                        <h1 className="user-name">
                            {profileInfo.firstName} {profileInfo.lastName}
                        </h1>
                        <p className="related-field">
                            {profileInfo.interest}, {profileInfo.workplace}
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

                    <ProfileBlogs profileBlogs={profileBlogs} />
                </div>
            </div>
        </div>
    );
};

export default Profile;
