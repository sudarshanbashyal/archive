import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clockIcon, fireIcon, loadingAnimation } from 'src/assets/SVGs';
import { followTopic, unfollowTopic } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import { bookmarkBlogInterface } from '../Profile/ProfileBookmarks/ProfileBookmarks';
import TextBlog from '../Profile/TextBlogs/TextBlog';
import './explore.css';
import ExploreTopics from './ExploreTopics/ExploreTopics';

interface topicInterface {
    topic_id: number;
    topic_title: string;
    topic_image: string;
}

const Explore = () => {
    const userState = useSelector((state: RootStore) => state.client);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );
    const dispatch = useDispatch();

    // array of blog topics that can be selected
    const [topics, setTopics] = useState<topicInterface[]>([]);

    // the current blog topic selected
    const [currentTopic, setCurrentTopic] = useState<number>();

    // sorting category of the displayed blogs
    const [blogCategory, setBlogCategory] = useState<string>('latest');
    const [exploreBlogs, setExploreBlogs] = useState<bookmarkBlogInterface[]>(
        []
    );

    // timeline for 'hot' category
    const [categoryTimeline, setCategoryTimeline] = useState('all');
    const changeTimelines = (e: any) => {
        setCategoryTimeline(e.target.value);
    };

    const [loading, setLoading] = useState<boolean>(false);

    // get all the topics
    useEffect(() => {
        (async function getTopics() {
            const res = await fetch('/blog/getTopics');
            const data = await res.json();

            if (data.ok) {
                setTopics(data.data);
            }
        })();
    }, []);

    // get all the blogs depending on the topic selected
    useEffect(() => {
        const currentCategory =
            blogCategory === 'latest' ? 'b.created_at' : 'cardinality(b.likes)';

        (async function generateBlogs() {
            if (blogCategory === 'latest') {
                setCategoryTimeline('all');
            }
            setLoading(true);

            const res = await fetch(
                `/blog/generateExplore/${currentCategory}/${currentTopic}/${categoryTimeline}`
            );
            const data = await res.json();

            if (data.ok) {
                setExploreBlogs(data.blogs);
                setLoading(false);
            }

            setLoading(false);
        })();
    }, [currentTopic, blogCategory, categoryTimeline]);

    return (
        <div
            className={
                'explore ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'explore-dark'
                    : '')
            }
        >
            <div className="topics-showcase">
                {topics.map(topic => (
                    <ExploreTopics
                        key={topic.topic_id}
                        topicId={topic.topic_id}
                        topicTitle={topic.topic_title}
                        topicImage={topic.topic_image}
                        currentTopic={currentTopic}
                        setCurrentTopic={setCurrentTopic}
                    />
                ))}
            </div>

            <div className="explore-function">
                <button
                    className={
                        'function-btn latest-blog-btn ' +
                        (blogCategory === 'latest'
                            ? 'selected-function-btn'
                            : '')
                    }
                    onClick={() => {
                        setBlogCategory('latest');
                    }}
                >
                    {clockIcon} <span>Latest Blogs</span>
                </button>

                <button
                    className={
                        'function-btn latest-blog-btn ' +
                        (blogCategory === 'hot' ? 'selected-function-btn' : '')
                    }
                    onClick={() => {
                        setBlogCategory('hot');
                    }}
                >
                    {fireIcon} <span>Hot Blogs</span>
                </button>

                {/* display select only if 'hot' category is selected */}
                {blogCategory === 'hot' ? (
                    <select onChange={changeTimelines}>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all" selected>
                            All Time
                        </option>
                    </select>
                ) : null}

                {/* display follow button only if a topic is selected */}
                {currentTopic &&
                    (userState.client?.profile.topicsFollowed.includes(
                        currentTopic
                    ) ? (
                        <button
                            className="follow-topic-btn"
                            onClick={() => {
                                dispatch(
                                    unfollowTopic(
                                        currentTopic,
                                        userState &&
                                            userState.client?.accessToken
                                    )
                                );
                            }}
                        >
                            Following Topic
                        </button>
                    ) : (
                        <button
                            className="follow-topic-btn"
                            disabled={
                                userState &&
                                userState.client!.profile.topicsFollowed
                                    .length < 4
                            }
                            onClick={() => {
                                dispatch(
                                    followTopic(
                                        currentTopic,
                                        userState &&
                                            userState.client?.accessToken
                                    )
                                );
                            }}
                        >
                            Follow Topic
                        </button>
                    ))}
            </div>

            <div className="blogs">
                {loading ? (
                    loadingAnimation
                ) : exploreBlogs.length === 0 ? (
                    <h2>No Blogs Found :(</h2>
                ) : (
                    exploreBlogs.map(blog => (
                        <TextBlog
                            key={blog.blogId}
                            blogId={blog.blogId}
                            blogTitle={blog.blogTitle}
                            authorId={blog.authorId}
                            authorName={blog.authorName}
                            authorProfileImage={blog.authorProfileImage}
                            blogTopic={blog.blogTopic}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Explore;
