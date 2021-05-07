import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    crownIcon,
    defaultProfileImage,
    downArrowIcon,
    heartFilledIcon,
    heartStrokeIcon,
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
    const [childComments, setChildComments] = useState<number | null>(null);

    // find out number of replies a comment has.
    useEffect(() => {
        (async function calculateChildren() {
            const res = await fetch(`/blog/countChildren/${comment.commentId}`);
            const data = await res.json();

            if (data.ok) {
                setChildComments(+data.children);
            }
        })();
    }, []);

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
                        {comment.likedBy!.length || null}
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

                {/* checking for replies */}
                {childComments ? (
                    <p className="show-all-replies">
                        {childComments > 1
                            ? `Show ${childComments} replies`
                            : `Show 1 reply`}
                        <span className="down-arrow">{downArrowIcon}</span>
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default Comment;
