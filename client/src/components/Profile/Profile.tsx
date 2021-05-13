import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadingAnimation } from 'src/assets/SVGs';
import { openModal } from 'src/redux/Actions/applicationActions';
import { followUser, unfollowUser } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import './profile.css';
import ProfileBlog from './ProfileBlogs/ProfileBlog/ProfileBlog';
import ProfileBlogs from './ProfileBlogs/ProfileBlogs';
import ProfileBookmarks from './ProfileBookmarks/ProfileBookmarks';
import ProfileDrafts from './ProfileDrafts/ProfileDrafts';
import ProfileNavigation from './ProfileNavigation/ProfileNavigation';

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
    likes: number[];
}

export const blogsType = 'blogs';
export const bookmarksType = 'bookmarks';
export const draftsType = 'drafts';
export type ProfileNavigationType =
    | typeof blogsType
    | typeof bookmarksType
    | typeof draftsType;

const Profile = (props: any) => {
    const { id: profileId } = props.match.params;
    const userState = useSelector((state: RootStore) => state.client);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    const dispatch = useDispatch();

    const [loading, setLoading] = useState<boolean>(false);

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

    const [currentProfileNavigation, setCurrentProfileNavigation] =
        useState<ProfileNavigationType>('blogs');

    useEffect(() => {
        (async function () {
            setLoading(true);
            setProfileBlogs([]);
            const res = await fetch(`/user/getUser/${profileId}`);
            const data = await res.json();

            if (data.ok) {
                // set up profile info
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
                            likes,
                        } = blog;

                        return {
                            blogId,
                            title,
                            createdAt,
                            headerImage,
                            topicTitle,
                            likes,
                        };
                    }
                );

                setProfileBlogs(profileBlogs => [
                    ...profileBlogs,
                    ...retrievedBlogs,
                ]);

                setLoading(false);
            } else {
                setUserExists(false);
                setLoading(false);
            }
        })();
    }, [profileId]);

    return loading ? (
        <div className="loading-animation">{loadingAnimation}</div>
    ) : (
        <div
            className={
                'profile ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'profile-dark'
                    : '')
            }
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

                    {/* Profile Navigation */}
                    {+profileId === userState.client?.profile.userId ? (
                        <ProfileNavigation
                            currentProfileNavigation={currentProfileNavigation}
                            setCurrentProfileNavigation={
                                setCurrentProfileNavigation
                            }
                        />
                    ) : (
                        <hr />
                    )}

                    {currentProfileNavigation === 'blogs' ? (
                        <ProfileBlogs profileBlogs={profileBlogs} />
                    ) : currentProfileNavigation === 'bookmarks' ? (
                        <ProfileBookmarks />
                    ) : (
                        <ProfileDrafts />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
