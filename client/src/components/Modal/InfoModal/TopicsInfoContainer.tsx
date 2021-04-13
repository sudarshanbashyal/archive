import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followTopic, unfollowTopic } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import { infoTopicInterface } from './InfoModal';

const TopicsInfoContainer = ({ topics }: { topics: infoTopicInterface[] }) => {
    const userState = useSelector((state: RootStore) => state.client);
    const accessToken = userState && userState.client?.accessToken;
    const dispatch = useDispatch();

    return (
        <div className="topics-container">
            {topics.map((topic: infoTopicInterface) => (
                <div className="topic" key={topic.topicId}>
                    <div className="topic-profile"></div>
                    <div className="topic-detail">{topic.topicTitle}</div>

                    {/* check if the current topic is followed by our user and display buttons accordingly */}
                    {userState &&
                    userState.client?.profile.topicsFollowed.includes(
                        topic.topicId
                    ) ? (
                        <button
                            // disable the unfollow button if less than 3 topics followed
                            disabled={
                                userState &&
                                userState.client.profile.topicsFollowed.length <
                                    3
                            }
                            onClick={() => {
                                dispatch(
                                    unfollowTopic(topic.topicId, accessToken)
                                );
                            }}
                            className="follow-btn"
                        >
                            Following
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                dispatch(
                                    followTopic(topic.topicId, accessToken)
                                );
                            }}
                            className="follow-btn"
                        >
                            Follow
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TopicsInfoContainer;
