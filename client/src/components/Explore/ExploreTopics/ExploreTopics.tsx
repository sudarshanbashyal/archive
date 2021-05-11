import React from 'react';

const ExploreTopics = ({
    topicId,
    topicTitle,
    topicImage,
    currentTopic,
    setCurrentTopic,
}: {
    topicId: number;
    topicTitle: string;
    topicImage: string;
    currentTopic: undefined | number;
    setCurrentTopic: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
    const changeTopic = () => {
        currentTopic === topicId
            ? setCurrentTopic(undefined)
            : setCurrentTopic(topicId);
    };

    return (
        <div
            className={
                'topic ' + (currentTopic == topicId ? 'selected-topic' : '')
            }
        >
            <div className="topic-image" onClick={changeTopic}>
                <img src={`${topicImage}.jpg`} alt={`${topicTitle} image`} />
            </div>

            <p className="topic-title">{topicTitle}</p>
        </div>
    );
};

export default ExploreTopics;
