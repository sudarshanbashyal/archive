import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    crownIcon,
    defaultProfileImage,
    downArrowIcon,
    heartFilledIcon,
    heartStrokeIcon,
    trashIcon,
} from 'src/assets/SVGs';
import { showSuccessToast } from 'src/components/Utils/ToastNotification';
import { RootStore } from 'src/redux/store';
import ChildrenComment from './ChildrenComment';
import { commentInterface } from './Comments';

const Comment = ({
    comment,
    blogAuthorId,
    blogId,
    deleteComment,
}: {
    comment: commentInterface;
    blogAuthorId: number;
    blogId: number;
    deleteComment: (commentId: number) => void;
}) => {
    const userState = useSelector((state: RootStore) => state.client);
    const accessToken = userState.client?.accessToken;

    const [replyToggled, setReplyToggled] = useState<boolean>(false);
    const [replyContent, setReplyContent] = useState<string>('');

    const [currentComment, setCurrentComment] =
        useState<commentInterface>(comment);

    const [childrenToggled, setChildrenToggled] = useState<boolean>(false);
    const [childrenNumber, setChildrenNumber] = useState<number | null>(0);
    const [childrenComments, setChildrenComments] = useState<
        commentInterface[]
    >([]);

    // find out number of replies a comment has.
    useEffect(() => {
        (async function calculateChildren() {
            const res = await fetch(`/blog/countChildren/${comment.commentId}`);
            const data = await res.json();

            if (data.ok) {
                setChildrenNumber(+data.children);
            }
        })();
    }, []);

    useEffect(() => {
        if (childrenToggled) {
            (async function getChildren() {
                const res = await fetch(
                    `/blog/getChildrenComment/${comment.commentId}`
                );
                const data = await res.json();

                if (data.ok) {
                    setChildrenComments(data.comments);
                }
            })();
        }
    }, [childrenToggled]);

    const toggleComment = async (status: string) => {
        const res = await fetch(
            `/blog/toggleComment/${comment.commentId}/${status}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${accessToken}`,
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

    const postReply = async () => {
        const res = await fetch(`/blog/postComment/${blogId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${accessToken}`,
            },
            body: JSON.stringify({
                commentContent: replyContent,
                parentId: comment.commentId,
            }),
        });

        const data = await res.json();
        if (data.ok) {
            setChildrenComments(childrenComments => [
                data.comment,
                ...childrenComments,
            ]);
            setReplyContent('');
            setReplyToggled(false);
            setChildrenToggled(true);
            setChildrenNumber(childrenNumber! + 1);
        }
    };

    const deleteChildComment = async (commentId: number) => {
        const res = await fetch(`/blog/deleteComment/${commentId}`, {
            headers: {
                authorization: `bearer ${accessToken}`,
            },
        });

        const data = await res.json();
        if (data.ok) {
            setChildrenComments(childrenComments =>
                childrenComments.filter(
                    comment => comment.commentId !== commentId
                )
            );

            showSuccessToast('Comment Removed!');
        }
    };

    return (
        <div className="comment">
            {/* display delete button if comment belongs to current user */}
            {currentComment.userId ===
            (userState && userState.client?.profile.userId) ? (
                <span
                    onClick={() => {
                        deleteComment(comment.commentId);
                    }}
                    className="delete-comment"
                >
                    {trashIcon}
                </span>
            ) : null}

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
                            value={replyContent}
                            onChange={e => {
                                setReplyContent(e.target.value);
                            }}
                            type="text"
                            name="comment-reply"
                            placeholder="Add a reply..."
                        ></input>

                        <div className="reply-buttons">
                            <button
                                className="reply-submit-button"
                                onClick={postReply}
                            >
                                Reply
                            </button>
                            <button
                                className="cancel-button"
                                onClick={() => {
                                    setReplyToggled(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* checking for replies */}
                {childrenNumber && childrenNumber > 0 ? (
                    <p
                        style={{
                            marginBottom: childrenToggled ? '30px' : '',
                        }}
                        onClick={() => {
                            setChildrenToggled(!childrenToggled);
                        }}
                        className="show-all-replies"
                    >
                        {childrenToggled
                            ? 'Hide Replies'
                            : childrenNumber > 1
                            ? `Show ${childrenNumber} replies`
                            : `Show 1 reply`}
                        <span className="down-arrow">{downArrowIcon}</span>
                    </p>
                ) : null}

                {childrenToggled
                    ? childrenComments.map(children => (
                          <ChildrenComment
                              key={children.commentId}
                              comment={children}
                              blogAuthorId={blogAuthorId}
                              deleteChildComment={deleteChildComment}
                          />
                      ))
                    : null}
            </div>
        </div>
    );
};

export default Comment;
