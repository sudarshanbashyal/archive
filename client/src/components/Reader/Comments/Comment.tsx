import moment from 'moment';
import React from 'react';
import { commentInterface } from './Comments';

const Comment = ({ comment }: { comment: commentInterface }) => {
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
        </div>
    );
};

export default Comment;
