import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { loadingAnimation } from 'src/assets/SVGs';
import { bookmarkBlogInterface } from 'src/components/Profile/ProfileBookmarks/ProfileBookmarks';
import TextBlog from 'src/components/Profile/TextBlogs/TextBlog';
import { showFailureToast } from 'src/components/Utils/ToastNotification';
import { RootStore } from 'src/redux/store';
import Blog from '../../Blog/Blog';
import './blogs.css';

const Blogs = () => {
    const userState = useSelector((state: RootStore) => state.client);
    const [loading, setLoading] = useState<boolean>(false);

    const [feedBlogs, setFeedBlogs] = useState<bookmarkBlogInterface[]>([]);

    useEffect(() => {
        setLoading(true);
        (async function generateFeed() {
            const res = await fetch(`/blog/generateFeed`, {
                headers: {
                    authorization: `bearer ${
                        userState && userState.client?.accessToken
                    }`,
                },
            });

            const data = await res.json();
            if (data.ok) {
                console.log(data);
                setFeedBlogs(data.feed);
                setLoading(false);
            } else {
                setLoading(false);
                showFailureToast('Something Went Wrong! Please try again.');
            }
        })();
    }, []);

    return !loading ? (
        <div className="blogs">
            {feedBlogs.map(blog => (
                <TextBlog
                    key={blog.blogId}
                    blogId={blog.blogId}
                    blogTitle={blog.blogTitle}
                    authorId={blog.authorId}
                    authorName={blog.authorName}
                    authorProfileImage={blog.authorProfileImage}
                    blogTopic={blog.blogTopic}
                />
            ))}
        </div>
    ) : (
        loadingAnimation
    );
};

export default Blogs;
