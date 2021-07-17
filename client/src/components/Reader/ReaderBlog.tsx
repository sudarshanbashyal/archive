import React, { useState, lazy, Suspense } from 'react';
import moment from 'moment';
import {
    bookmarkStrokeIcon,
    bookmarkFilledIcon,
    heartFilledIcon,
    heartStrokeIcon,
    loadingAnimation,
    defaultProfileImage,
    trashIcon,
} from 'src/assets/SVGs';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootStore } from 'src/redux/store';
import {
    toggleBookmark,
    unfollowUser,
    followUser,
} from 'src/redux/Actions/userActions';
import { openModal } from 'src/redux/Actions/applicationActions';

const ReaderWysiwyg = lazy(() => import('./ReaderWysiwyg'));

interface readerBlogInterface {
    blogId: number;
    title: string;
    blogContent: string;
    headerImage: string;
    createdAt: string;
    likes: number[] | null;
    userId: number;
    firstName: string;
    lastName: string;
    interest: string | null;
    profileImage: string | null;
}

const ReaderBlog = ({
    blogId,
    title,
    blogContent,
    headerImage,
    createdAt,
    likes,
    userId,
    firstName,
    lastName,
    interest,
    profileImage,
}: readerBlogInterface) => {
    const [blogLikes, setBlogLikes] = useState<any>(likes);
    const userState = useSelector((state: RootStore) => state.client);
    const dispatch = useDispatch();

    const toggleLikes = async (status: string) => {
        const res = await fetch(`/blog/toggleLikes/${blogId}/${status}`, {
            headers: {
                authorization: `bearer ${
                    userState && userState.client?.accessToken
                }`,
            },
            credentials: 'include',
        });
        const data = await res.json();
        if (data.ok) {
            setBlogLikes(data.blog);
        }
    };

    const toggleBookmarkStatus = (status: string) => {
        dispatch(
            toggleBookmark(
                blogId,
                status,
                userState && userState.client?.accessToken
            )
        );
    };

    return (
        <div className="reader-blog-container">
            <h1 className="blog-title">{title}</h1>
            <div className="user-info">
                <div className="user-profile-picture">
                    <img src={profileImage || defaultProfileImage} alt="" />
                </div>

                <Link
                    style={{
                        color: 'black',
                        textDecoration: 'none',
                    }}
                    to={`/user/${userId}`}
                >
                    <p className="user-name">
                        {firstName} {lastName}
                    </p>
                </Link>

                {userState &&
                    (userState.client?.profile.userId ===
                    userId ? null : userState.client?.profile.usersFollowed.includes(
                          userId
                      ) ? (
                        <button
                            className="follow-btn"
                            onClick={() => {
                                dispatch(
                                    unfollowUser(
                                        userId,
                                        userState.client?.accessToken
                                    )
                                );
                            }}
                        >
                            Following
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                dispatch(
                                    followUser(
                                        userId,
                                        userState.client?.accessToken
                                    )
                                );
                            }}
                            className="follow-btn"
                        >
                            Follow
                        </button>
                    ))}
            </div>

            <div className="blog-info">
                <span className="blog-date">
                    {moment(createdAt).format('DD')}{' '}
                    {moment(createdAt).format('MMMM')},{' '}
                    {moment(createdAt).format('YYYY')}
                </span>

                <div className="blog-icons">
                    <span className="heart-icon">
                        {blogLikes &&
                        blogLikes!.includes(
                            userState && userState.client!.profile.userId
                        ) ? (
                            <span
                                className="filled-heart"
                                onClick={() => {
                                    toggleLikes('array_remove');
                                }}
                            >
                                {heartFilledIcon}
                            </span>
                        ) : (
                            <span
                                className="stroke-heart"
                                onClick={() => {
                                    toggleLikes('array_append');
                                }}
                            >
                                {heartStrokeIcon}
                            </span>
                        )}
                    </span>

                    {userState &&
                    userState.client?.profile.bookmarks?.includes(+blogId) ? (
                        <span
                            onClick={() => {
                                toggleBookmarkStatus('array_remove');
                            }}
                        >
                            {bookmarkFilledIcon}
                        </span>
                    ) : (
                        <span
                            onClick={() => {
                                toggleBookmarkStatus('array_append');
                            }}
                        >
                            {bookmarkStrokeIcon}
                        </span>
                    )}

                    {userState &&
                    userState.client!.profile.userId === userId ? (
                        <span
                            onClick={() => {
                                dispatch(openModal('blogDeleteModal'));
                            }}
                        >
                            {trashIcon}
                        </span>
                    ) : (
                        ''
                    )}
                </div>
            </div>

            <div className="blog-header">
                <img src={headerImage} alt="blog-header" />
            </div>

            <Suspense fallback={loadingAnimation}>
                <ReaderWysiwyg blogContent={blogContent} />
            </Suspense>
        </div>
    );
};

export default ReaderBlog;
