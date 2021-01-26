import React from 'react';
import './profileBlogs.css';
import ProfileBlog from './ProfileBlog/ProfileBlog';

const ProfileBlogs = () => {
    const blogArray = [
        {
            blogTopic: 'Programming',
            blogTitle:
                'When should you alternated between vanilla JS and a JS framework?',
            likes: 10,
            publishedOn: '15 January, 2021',
        },
        {
            blogTopic: 'Programming',
            blogTitle:
                'When should you alternated between vanilla JS and a JS framework?',
            likes: 10,
            publishedOn: '15 January, 2021',
        },
        {
            blogTopic: 'Programming',
            blogTitle:
                'When should you alternated between vanilla JS and a JS framework?',
            likes: 10,
            publishedOn: '15 January, 2021',
        },
        {
            blogTopic: 'Programming',
            blogTitle:
                'When should you alternated between vanilla JS and a JS framework?',
            likes: 10,
            publishedOn: '15 January, 2021',
        },
    ];

    return (
        <div className="profile-blogs">
            {blogArray.map((blog) => (
                <ProfileBlog
                    blogTopic={blog.blogTopic}
                    blogTitle={blog.blogTitle}
                    likes={blog.likes}
                    publishedOn={blog.publishedOn}
                />
            ))}
        </div>
    );
};

export default ProfileBlogs;
