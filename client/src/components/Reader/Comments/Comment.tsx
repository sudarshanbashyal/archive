import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { heartFilledIcon, heartStrokeIcon } from 'src/assets/SVGs';
import { RootStore } from 'src/redux/store';
import { commentInterface } from './Comments';

const Comment = ({
    comment,
    toggleComment,
}: {
    comment: commentInterface;
    toggleComment: (commentId: number, status: string) => void;
}) => {
    const userState = useSelector((state: RootStore) => state.client);

    return (
        <div className="comment">
            <div className="comment-user-info">
                <div className="user-profile">
                    <img
                        src={
                            comment.profileImage
                                ? comment.profileImage
                                : 'https://www.pngitem.com/pimgs/m/150-1503941_user-windows-10-user-icon-png-transparent-png.png'
                        }
                        alt="user-profile-image"
                    />
                </div>
                <span className="user-name">
                    {comment.firstName} {comment.lastName}
                </span>
                <span className="comment-date">
                    {moment(comment.createdAt).format('MMM Do')}
                </span>
            </div>

            <div className="comment-body">{comment.commentContent}</div>

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

                <span className="reply-comment">Reply To</span>
            </div>
        </div>
    );
};

export default Comment;
