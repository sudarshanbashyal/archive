import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { bookmarkFilledIcon, defaultProfileImage } from 'src/assets/SVGs';
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
    const dispatch = useDispatch();

    return (
        <div className="text-blog">
            <div className="blog-info">
                <div className="author-profile-image">
                    <img src={authorProfileImage || defaultProfileImage} />
                </div>
                <Link
                    style={{ color: 'black', textDecoration: 'none' }}
                    to={`/user/${authorId}`}
                >
                    <span className="author-name">{authorName}</span>
                </Link>
                |<span className="blog-topic">{blogTopic}</span>
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
            </div>
            <Link
                style={{ color: 'black', textDecoration: 'none' }}
                to={`/blog/${blogId}`}
            >
                <h2>{blogTitle}</h2>
            </Link>
        </div>
    );
};

export default TextBlog;
