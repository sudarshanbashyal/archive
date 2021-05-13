import React, { useState } from 'react';
import { ProfileBlogType } from '../../Profile';
import moment from 'moment';
import './blog.css';
import {
    bookmarkFilledIcon,
    bookmarkStrokeIcon,
    heartFilledIcon,
    heartStrokeIcon,
} from 'src/assets/SVGs';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from 'src/redux/store';
import { toggleBookmark } from 'src/redux/Actions/userActions';
import { Link } from 'react-router-dom';

const ProfileBlog = ({
    blogId,
    title,
    createdAt,
    topicTitle,
    headerImage,
    likes,
}: ProfileBlogType) => {
    const [blogLikes, setBlogLikes] = useState<any>(likes);
    const userState = useSelector((state: RootStore) => state.client);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

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
        <div
            className={
                'p-blog ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'p-blog-dark'
                    : '')
            }
        >
            <strong>{topicTitle}</strong>
            <Link className="link" to={`/blog/${blogId}`}>
                <h2>{title}</h2>
            </Link>

            <div className="blog-header-image">
                <img src={headerImage} alt="" />
            </div>

            <div className="blog-info">
                <div className="icons">
                    {blogLikes &&
                    blogLikes.includes(
                        userState && userState.client?.profile.userId
                    ) ? (
                        <span
                            onClick={() => {
                                toggleLikes('array_remove');
                            }}
                            className="heart-filled"
                        >
                            {heartFilledIcon}
                        </span>
                    ) : (
                        <span
                            onClick={() => {
                                toggleLikes('array_append');
                            }}
                            className="heart-stroke"
                        >
                            {heartStrokeIcon}
                        </span>
                    )}
                    {blogLikes ? blogLikes.length : null}

                    {userState &&
                    userState.client?.profile.bookmarks?.includes(blogId) ? (
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
                </div>
                <span className="published-date">
                    {moment(createdAt).format('DD')}{' '}
                    {moment(createdAt).format('MMMM')},{' '}
                    {moment(createdAt).format('YYYY')}
                </span>
            </div>
        </div>
    );
};

export default ProfileBlog;
