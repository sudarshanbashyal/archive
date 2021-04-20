import React from 'react';
import './profileBlogs.css';
import ProfileBlog from './ProfileBlog/ProfileBlog';
import { ProfileBlogType } from '../Profile';

type BlogPropType = {
    profileBlogs: ProfileBlogType[];
};

const ProfileBlogs = ({ profileBlogs }: BlogPropType) => {
    return (
        <div className="profile-blogs">
            {profileBlogs[0] ? (
                profileBlogs.map(blog => (
                    <ProfileBlog
                        key={blog.blogId}
                        blogId={blog.blogId}
                        title={blog.title}
                        createdAt={blog.createdAt}
                        topicTitle={blog.topicTitle}
                        headerImage={blog.headerImage}
                        likes={blog.likes}
                    />
                ))
            ) : (
                <h2 className="no-blogs-message">
                    This User Does not have any Blogs.
                </h2>
            )}
        </div>
    );
};

export default ProfileBlogs;
