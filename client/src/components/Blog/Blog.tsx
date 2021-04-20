import React from 'react';
import './blog.css';

const Blog = ({
    authorName,
    blogTopic,
    blogTitle,
}: {
    authorName: string;
    blogTopic: string;
    blogTitle: string;
}) => {
    return (
        <div className="blog">
            <div className="blog-header">
                <div className="blog-info">
                    <div className="profile"></div>
                    <span className="author-name">{authorName}</span>{' '}
                    <span className="divider">|</span>{' '}
                    <span className="blog-topic">{blogTopic}</span>
                </div>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path d="M16 2v17.582l-4-3.512-4 3.512v-17.582h8zm2-2h-12v24l6-5.269 6 5.269v-24z" />
                </svg>
            </div>

            <div className="blog-title">
                <h2>{blogTitle}</h2>
            </div>
        </div>
    );
};

export default Blog;
