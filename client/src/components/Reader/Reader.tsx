import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { loadingAnimation } from 'src/assets/SVGs';
import { RootStore } from 'src/redux/store';
// import Comments from './Comments/Comments';
import './reader.css';
import ReaderBlog from './ReaderBlog';
// import ReaderUserInfo from './ReaderUserInfo';
const Comments = lazy(() => import('./Comments/Comments'));

interface blogInterface {
    title: string;
    blogContent: string;
    headerImage: string;
    createdAt: string;
    likes: number[] | null;
    userId: number;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    interest: string | null;
}

const Reader = (props: any) => {
    const { id: blogId } = props.match.params;

    const userState = useSelector((state: RootStore) => state.client);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    const [blog, setBlog] = useState<blogInterface | null>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async function getBlog() {
            const res = await fetch(`/blog/getBlog/${blogId}`);
            if (res.status === 404) {
                setLoading(false);
                return;
            }

            const data = await res.json();
            if (data.ok) {
                const responseBlog = data.blog;
                setBlog({
                    title: responseBlog.title,
                    blogContent: responseBlog.blog_content,
                    headerImage: responseBlog.header_image,
                    createdAt: responseBlog.created_at,
                    likes: responseBlog.likes,
                    userId: responseBlog.user_id,
                    firstName: responseBlog.first_name,
                    lastName: responseBlog.last_name,
                    profileImage: responseBlog.profileimage,
                    interest: responseBlog.interest,
                });
                setLoading(false);
            }

            //
        })();
    }, []);

    return loading ? (
        <div className="loading-animation">{loadingAnimation}</div>
    ) : !loading && !blog ? (
        <div>no blog found</div>
    ) : (
        <div
            className={
                'reader-container ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'reader-container-dark'
                    : '')
            }
        >
            <div className="blog-container">
                <ReaderBlog
                    blogId={blogId}
                    title={blog!.title}
                    blogContent={blog!.blogContent}
                    headerImage={blog!.headerImage}
                    createdAt={blog!.createdAt}
                    likes={blog!.likes}
                    userId={blog!.userId}
                    firstName={blog!.firstName}
                    lastName={blog!.lastName}
                    interest={blog!.interest}
                    profileImage={blog!.profileImage}
                />

                <Suspense fallback={loadingAnimation}>
                    <Comments blogId={blogId} blogAuthorId={blog!.userId} />
                </Suspense>
            </div>
        </div>
    );
};

export default Reader;
