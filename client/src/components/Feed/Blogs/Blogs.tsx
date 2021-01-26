import React from 'react';
import Blog from '../../Blog/Blog';
import './blogs.css';

const Blogs = () => {
    const blogArray = [
        {
            authorName: 'Carson',
            blogTopic: 'Programming',
            blogTitle:
                'When should you alternate between vanilla JS and a JS framework?',
        },
        {
            authorName: 'Carson',
            blogTopic: 'Programming',
            blogTitle:
                'How do you go about learning algorithms and data structures?',
        },
        {
            authorName: 'Carson',
            blogTopic: 'Programming',
            blogTitle:
                'Creating a fullstack reddit clone with React, PostgresSQL and Node...',
        },
        {
            authorName: 'Carson',
            blogTopic: 'Programming',
            blogTitle:
                'How I got a job offer at Facebook right after graduating from college.',
        },
        {
            authorName: 'Jessica',
            blogTopic: 'Cooking',
            blogTitle:
                'You should definitely make this easy homemade Pizza...Yum',
        },
        {
            authorName: 'Carson',
            blogTopic: 'Programming',
            blogTitle:
                'What is the difference between a frontend developer and a backend developer?',
        },
        {
            authorName: 'Carson',
            blogTopic: 'Programming',
            blogTitle: 'Best Design Books that will boost up your UI/UX.',
        },
        {
            authorName: 'Carson',
            blogTopic: 'Programming',
            blogTitle: 'Best Design Books that will boost up your UI/UX.',
        },
    ];

    return (
        <div className="blogs">
            {blogArray.map((blog) => (
                <Blog
                    authorName={blog.authorName}
                    blogTopic={blog.blogTopic}
                    blogTitle={blog.blogTitle}
                />
            ))}
        </div>
    );
};

export default Blogs;
