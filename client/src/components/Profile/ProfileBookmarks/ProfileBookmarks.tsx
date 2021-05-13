import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { loadingAnimation } from 'src/assets/SVGs';
import { RootStore } from 'src/redux/store';
import TextBlog from '../TextBlogs/TextBlog';
import './profileBookmarks.css';

export interface bookmarkBlogInterface {
    blogId: number;
    authorId: number;
    authorName: string;
    authorProfileImage: string | null;
    blogTopic: string;
    blogTitle: string;
}

const ProfileBookmarks = () => {
    const userState = useSelector((state: RootStore) => state.client);

    const [bookmarkBlogs, setBookmarkBlogs] = useState<bookmarkBlogInterface[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async function getBookmarks() {
            setBookmarkBlogs([]);
            setLoading(true);
            const res = await fetch('/blog/getBookmarks', {
                headers: {
                    authorization: `bearer ${
                        userState && userState.client?.accessToken
                    }`,
                },
            });
            const data = await res.json();

            if (data.ok) {
                data.bookmarks.map((bookmark: any) => {
                    setBookmarkBlogs(bookmarkBlogs => [
                        {
                            blogId: bookmark.blog_id,
                            authorId: bookmark.user_id,
                            authorName: bookmark.first_name,
                            authorProfileImage: bookmark.profileimage,
                            blogTopic: bookmark.topic_title,
                            blogTitle: bookmark.title,
                        },
                        ...bookmarkBlogs,
                    ]);
                });

                setLoading(false);
                //
            } else {
                setLoading(false);
            }
        })();
    }, [userState && userState.client?.profile.bookmarks]);

    return loading ? (
        loadingAnimation
    ) : (
        <div className="bookmark-container">
            {bookmarkBlogs[0] ? (
                bookmarkBlogs.map(blog => (
                    <TextBlog
                        key={blog.blogId}
                        blogId={blog.blogId}
                        authorId={blog.authorId}
                        authorName={blog.authorName}
                        authorProfileImage={blog.authorProfileImage}
                        blogTitle={blog.blogTitle}
                        blogTopic={blog.blogTopic}
                    />
                ))
            ) : (
                <h2>No Bookmarks found.</h2>
            )}
        </div>
    );
};

export default ProfileBookmarks;
