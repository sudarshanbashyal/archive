import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    crownIcon,
    defaultProfileImage,
    heartFilledIcon,
    heartStrokeIcon,
} from 'src/assets/SVGs';
import { RootStore } from 'src/redux/store';
import { commentInterface } from './Comments';

const ChildrenComment = ({
    comment,
    blogAuthorId,
}: {
    comment: commentInterface;
    blogAuthorId: number;
}) => {
    const [currentComment, setCurrentComment] =
        useState<commentInterface>(comment);

    const userState = useSelector((state: RootStore) => state.client);

    const toggleComment = async (status: string) => {
        const res = await fetch(
            `/blog/toggleComment/${comment.commentId}/${status}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${
                        userState && userState.client?.accessToken
                    }`,
                },
            }
        );
        const data = await res.json();

        if (data.ok) {
            setCurrentComment({
                ...currentComment,
                likedBy: data.likedBy,
            });
        }
    };

    return (
        <div className="comment">
            <div className="comment-user-info">
                <div className="user-profile">
                    <img
                        src={comment.profileImage || defaultProfileImage}
                        alt="user-profile-image"
                    />
                </div>
            </div>

            <div className="comment-body">
                <span className="user-name">
                    {comment.firstName} {comment.lastName}
                    {comment.userId === blogAuthorId ? (
                        <span className="author-icon">{crownIcon}</span>
                    ) : null}
                </span>

                <span className="comment-date">
                    {moment(comment.createdAt).format('MMM Do')}
                </span>

                <div className="comment-content">{comment.commentContent}</div>

                <div className="comment-functions">
                    <span className="like-comment">
                        {currentComment.likedBy!.includes(
                            userState && userState.client!.profile.userId
                        ) ? (
                            <span
                                className="heart-filled"
                                onClick={() => {
                                    toggleComment('array_remove');
                                }}
                            >
                                {heartFilledIcon}
                            </span>
                        ) : (
                            <span
                                onClick={() => {
                                    toggleComment('array_append');
                                }}
                            >
                                {heartStrokeIcon}
                            </span>
                        )}
                        {currentComment.likedBy!.length || null}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChildrenComment;
