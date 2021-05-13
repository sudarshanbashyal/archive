import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    bookmarkFilledIcon,
    bookmarkStrokeIcon,
    defaultProfileImage,
} from 'src/assets/SVGs';
import { toggleBookmark } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import { bookmarkBlogInterface } from '../ProfileBookmarks/ProfileBookmarks';
import './textBlog.css';

const TextBlog = ({
    blogId,
    authorId,
    authorName,
    authorProfileImage,
    blogTitle,
    blogTopic,
}: bookmarkBlogInterface) => {
    const userState = useSelector((state: RootStore) => state.client);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    const dispatch = useDispatch();

    return (
        <div
            className={
                'text-blog ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'text-blog-dark'
                    : '')
            }
        >
            <div className="blog-info">
                <div className="author-profile-image">
                    <img src={authorProfileImage || defaultProfileImage} />
                </div>
                <Link className="link" to={`/user/${authorId}`}>
                    <span className="author-name">{authorName}</span>
                </Link>
                |<span className="blog-topic">{blogTopic}</span>
                {userState &&
                userState.client?.profile.bookmarks &&
                userState.client?.profile.bookmarks.includes(blogId) ? (
                    <span
                        className="bookmark-icon"
                        onClick={() => {
                            dispatch(
                                toggleBookmark(
                                    blogId,
                                    'array_remove',
                                    userState && userState.client?.accessToken
                                )
                            );
                        }}
                    >
                        {bookmarkFilledIcon}
                    </span>
                ) : (
                    <span
                        className="bookmark-icon"
                        onClick={() => {
                            dispatch(
                                toggleBookmark(
                                    blogId,
                                    'array_append',
                                    userState && userState.client?.accessToken
                                )
                            );
                        }}
                    >
                        {bookmarkStrokeIcon}
                    </span>
                )}
            </div>
            <Link className="link" to={`/blog/${blogId}`}>
                <p className="blog-title">{blogTitle}</p>
            </Link>
        </div>
    );
};

export default TextBlog;
