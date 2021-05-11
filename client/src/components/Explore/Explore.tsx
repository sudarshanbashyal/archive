import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clockIcon, fireIcon } from 'src/assets/SVGs';
import { followTopic, unfollowTopic } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import './explore.css';
import ExploreTopics from './ExploreTopics/ExploreTopics';

interface topicInterface {
    topic_id: number;
    topic_title: string;
    topic_image: string;
}

const Explore = () => {
    const userState = useSelector((state: RootStore) => state.client);
    const dispatch = useDispatch();

    const [topics, setTopics] = useState<topicInterface[]>([]);
    const [currentTopic, setCurrentTopic] = useState<number>();

    const [blogCategory, setBlogCategory] = useState<string>('latest');

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

    return (
        <div className="explore">
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
                    <select>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>All Time</option>
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
        </div>
    );
};

export default Explore;
