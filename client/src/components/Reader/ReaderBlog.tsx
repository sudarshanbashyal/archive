import React, { useState } from 'react';
import moment from 'moment';
import {
    bookmarkStrokeIcon,
    commentIcon,
    heartFilledIcon,
    heartStrokeIcon,
} from 'src/assets/SVGs';
import { useSelector } from 'react-redux';
import { RootStore } from 'src/redux/store';
import ReaderWysiwyg from './ReaderWysiwyg';

interface readerBlogInterface {
    blogId: number;
    title: string;
    blogContent: string;
    headerImage: string;
    createdAt: string;
    likes: number[] | null;
}

const ReaderBlog = ({
    blogId,
    title,
    blogContent,
    headerImage,
    createdAt,
    likes,
}: readerBlogInterface) => {
    const [blogLikes, setBlogLikes] = useState<any>(likes);
    const userState = useSelector((state: RootStore) => state.client);

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

    return (
        <div className="reader-blog-container">
            <h1 className="blog-title">{title}</h1>
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

                    <span className="bookmark-icon">{bookmarkStrokeIcon}</span>
                </div>
            </div>

            <div className="blog-header">
                <img src={headerImage} alt="blog-header" />
            </div>

            <ReaderWysiwyg blogContent={blogContent} />
        </div>
    );
};

export default ReaderBlog;
