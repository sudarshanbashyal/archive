import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeIcon, loadingAnimation } from 'src/assets/SVGs';
import { closeModal } from 'src/redux/Actions/applicationActions';
import './infoModal.css';
import TopicsInfoContainer from './TopicsInfoContainer';
import UsersInfoContainer from './UsersInfoContainer';

export interface infoUserInterface {
    userId: number;
    firstName: string;
    lastName: string;
    profileImage: string | undefined | null;
}

export interface infoTopicInterface {
    topicId: number;
    topicTitle: string;
    topicImage: string;
}

const InfoModal = ({ infoType }: { infoType: String }) => {
    const currentURL = window.location.href;

    const profileId = +currentURL.charAt(currentURL.length - 1);
    const infoEndPoint =
        infoType === 'Following'
            ? `/user/getFollowing/${profileId}`
            : `/user/getFollowers/${profileId}`;

    const [users, setUsers] = useState<infoUserInterface[]>([]);
    const [topics, setTopics] = useState<infoTopicInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    // current navigation of the profile modal: People | Topics
    const [currentInfo, setCurrentInfo] = useState('People');

    useEffect(() => {
        if (currentInfo === 'People') {
            // set users to empty array to avoid duplicate entries in the array = )
            setUsers([]);
            setLoading(true);
            (async function getUsers() {
                //
                const res = await fetch(infoEndPoint);
                const data = await res.json();

                if (data.ok) {
                    data.profileUsers.forEach((u: any) => {
                        const newUser: infoUserInterface = {
                            userId: u.user_id,
                            firstName: u.first_name,
                            lastName: u.last_name,
                            profileImage: u.profileimage,
                        };
                        setUsers(users => [...users, newUser]);
                    });
                    setLoading(false);
                } else setLoading(false);
                //
            })();
        } else {
            // set topics to empty array too
            setTopics([]);
            setLoading(true);

            (async function getTopics() {
                //
                const res = await fetch(`/blog/getFollowingBlogs/${profileId}`);
                const data = await res.json();

                if (data.ok) {
                    data.topics.forEach((topic: any) => {
                        const newTopic: infoTopicInterface = {
                            topicId: topic.topic_id,
                            topicTitle: topic.topic_title,
                            topicImage: topic.topic_image,
                        };

                        setTopics(topics => [...topics, newTopic]);
                    });
                    setLoading(false);
                } else setLoading(false);
                //
            })();
            //
        }
        //
    }, [currentInfo]);

    return (
        <div className="info-modal">
            <span
                className="close-modal"
                onClick={() => {
                    dispatch(closeModal);
                }}
            >
                {closeIcon}
            </span>
            <h3 className="info-title">{infoType}</h3>

            {/* Only display info navigaton when on following modal, not on follower modal */}
            {infoType === 'Following' ? (
                <div className="info-navigation">
                    <div
                        className={
                            'info-topic ' +
                            (currentInfo === 'People' ? 'active-topic' : '')
                        }
                    >
                        <span
                            className="topic-title"
                            onClick={() => {
                                setCurrentInfo('People');
                            }}
                        >
                            People
                        </span>
                    </div>
                    <div
                        className={
                            'info-topic ' +
                            (currentInfo === 'Topic' ? 'active-topic' : '')
                        }
                    >
                        <span
                            className="topic-title"
                            onClick={() => {
                                setCurrentInfo('Topic');
                            }}
                        >
                            Topics
                        </span>
                    </div>
                </div>
            ) : null}

            {/* checking which navigation is open at the moment */}
            {loading ? (
                <div className="svg-container">
                    <span className="loading-svg">{loadingAnimation}</span>
                </div>
            ) : currentInfo === 'People' ? (
                <UsersInfoContainer users={users} />
            ) : (
                <TopicsInfoContainer topics={topics} />
            )}
        </div>
    );
};

export default InfoModal;
