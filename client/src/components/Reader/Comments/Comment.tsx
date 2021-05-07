import moment from 'moment';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    crownIcon,
    defaultProfileImage,
    heartFilledIcon,
    heartStrokeIcon,
    pencilIcon,
} from 'src/assets/SVGs';
import { RootStore } from 'src/redux/store';
import { commentInterface } from './Comments';

const Comment = ({
    comment,
    toggleComment,
    blogAuthorId,
}: {
    comment: commentInterface;
    toggleComment: (commentId: number, status: string) => void;
    blogAuthorId: number;
}) => {
    const userState = useSelector((state: RootStore) => state.client);

    const [replyToggled, setReplyToggled] = useState<boolean>(false);

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
                        {comment.likedBy!.includes(
                            userState && userState.client!.profile.userId
                        ) ? (
                            <span
                                className="heart-filled"
                                onClick={() => {
                                    toggleComment(
                                        comment.commentId,
                                        'array_remove'
                                    );
                                }}
                            >
                                {heartFilledIcon}
                            </span>
                        ) : (
                            <span
                                onClick={() => {
                                    toggleComment(
                                        comment.commentId,
                                        'array_append'
                                    );
                                }}
                            >
                                {heartStrokeIcon}
                            </span>
                        )}
                    </span>

                    <span
                        className="reply-comment"
                        onClick={() => {
                            setReplyToggled(!replyToggled);
                        }}
                    >
                        Reply To
                    </span>
                </div>

                {replyToggled ? (
                    <div className="reply-textfield">
                        <input
                            type="text"
                            name="comment-reply"
                            placeholder="Add a reply..."
                        ></input>

                        <div className="reply-buttons">
                            <button className="reply-submit-button">
                                Reply
                            </button>
                            <button className="cancel-button">Cancel</button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Comment;
