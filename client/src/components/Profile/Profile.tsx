import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { openModal } from 'src/redux/Actions/applicationActions';
import { followUser, unfollowUser } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import './profile.css';
import ProfileBlogs from './ProfileBlogs/ProfileBlogs';

interface ProfileInfoType {
    firstName: string;
    lastName: string;
    interest: string;
    workplace: string;
    topicsFollowed: number[];
    usersFollowed: number[];
    userFollowers: number;
    profileimage?: string | undefined;
    headerimage?: string | undefined;
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
    const userState = useSelector((state: RootStore) => state.client);
    const dispatch = useDispatch();

    const [userExists, setUserExists] = useState<boolean>(true);
    const [profileInfo, setProfileInfo] = useState<ProfileInfoType>({
        firstName: '',
        lastName: '',
        interest: '',
        workplace: '',
        topicsFollowed: [],
        usersFollowed: [],
        userFollowers: 0,
    });
    const [profileBlogs, setProfileBlogs] = useState<ProfileBlogType[]>([]);

    useEffect(() => {
        (async function () {
            setProfileBlogs([]);
            const res = await fetch(`/user/getUser/${profileId}`);
            const data = await res.json();

            if (data.ok) {
                // set up profile info
                console.log(data.info[0]);
                let {
                    first_name,
                    last_name,
                    interest,
                    workplace,
                    users_followed,
                    topics_followed,
                    profileimage,
                    headerimage,
                } = data.info[0];
                setProfileInfo({
                    firstName: first_name,
                    lastName: last_name,
                    interest,
                    workplace,
                    topicsFollowed: topics_followed,
                    usersFollowed: users_followed,
                    userFollowers: data.followers.length,
                    profileimage,
                    headerimage,
                });

                if (!data.info[0].title) {
                    return;
                }

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

                setProfileBlogs(profileBlogs => [
                    ...profileBlogs,
                    ...retrievedBlogs,
                ]);
            } else {
                setUserExists(false);
            }
        })();
    }, [profileId]);

    return (
        <div
            className="profile"
            style={{
                marginTop:
                    profileInfo && profileInfo.headerimage ? '0px' : '50px',
            }}
        >
            {profileInfo && profileInfo.headerimage ? (
                <div className="header-image">
                    <img src={profileInfo.headerimage} alt="" />
                </div>
            ) : null}

            <div className="content-container">
                <div className="profile">
                    <div className="profile-picture">
                        <img
                            src={
                                profileInfo && profileInfo.profileimage
                                    ? profileInfo.profileimage
                                    : 'https://www.pngitem.com/pimgs/m/150-1503941_user-windows-10-user-icon-png-transparent-png.png'
                            }
                            alt=""
                        />
                    </div>

                    {/* check user id and display buttons accordingly */}
                    {+profileId === userState.client!.profile.userId ? (
                        <Link to="/settings">
                            <button className="follow-btn">Edit Profile</button>
                        </Link>
                    ) : userState &&
                      userState.client?.profile.usersFollowed.includes(
                          +profileId
                      ) ? (
                        <button
                            className="follow-btn"
                            onClick={() => {
                                dispatch(
                                    unfollowUser(
                                        +profileId,
                                        userState &&
                                            userState.client?.accessToken
                                    )
                                );
                            }}
                        >
                            Unfollow
                        </button>
                    ) : (
                        <button
                            className="follow-btn"
                            onClick={() => {
                                dispatch(
                                    followUser(
                                        +profileId,
                                        userState &&
                                            userState.client?.accessToken
                                    )
                                );
                            }}
                        >
                            Follow
                        </button>
                    )}
                </div>

                <div className="content">
                    <div className="profile-info">
                        <h1 className="user-name">
                            {profileInfo.firstName} {profileInfo.lastName}
                        </h1>
                        <p className="related-field">
                            {profileInfo.interest} {profileInfo.workplace}
                        </p>

                        <div className="profile-stats">
                            <span
                                className="follower-stat"
                                onClick={() => {
                                    dispatch(openModal('followers'));
                                }}
                            >
                                <strong>{profileInfo.userFollowers}</strong>{' '}
                                Followers
                            </span>
                            <span className="blog-stat">
                                <strong>{profileBlogs.length}</strong> Blogs
                            </span>
                            <span
                                className="following-stat"
                                onClick={() => {
                                    dispatch(openModal('following'));
                                }}
                            >
                                <strong>
                                    {profileInfo.usersFollowed.length +
                                        profileInfo.topicsFollowed.length}
                                </strong>{' '}
                                Following
                            </span>
                        </div>
                    </div>

                    <hr />

                    {profileBlogs[0] ? (
                        <ProfileBlogs profileBlogs={profileBlogs} />
                    ) : (
                        <h2 className="no-blogs-message">
                            This user does not have any blogs.
                        </h2>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
