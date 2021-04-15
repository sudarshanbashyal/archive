import React, { useState } from 'react';
import { ProfileBlogType } from '../../Profile';
import moment from 'moment';
import './blog.css';
import { heartFilledIcon, heartStrokeIcon } from 'src/assets/SVGs';
import { useSelector } from 'react-redux';
import { RootStore } from 'src/redux/store';

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

    const changeBlogStatus = async (route: string) => {
        const res = await fetch(`/blog/${route}/${blogId}`, {
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

    return (
        <div className="p-blog">
            <strong>{topicTitle}</strong>
            <h2>{title}</h2>
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
                                changeBlogStatus('dislikeBlog');
                            }}
                            className="heart-filled"
                        >
                            {heartFilledIcon}
                        </span>
                    ) : (
                        <span
                            onClick={() => {
                                changeBlogStatus('likeBlog');
                            }}
                            className="heart-stroke"
                        >
                            {heartStrokeIcon}
                        </span>
                    )}
                    {blogLikes ? blogLikes.length : null}

                    <svg
                        className="bookmark-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path d="M16 2v17.582l-4-3.512-4 3.512v-17.582h8zm2-2h-12v24l6-5.269 6 5.269v-24z" />
                    </svg>
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
