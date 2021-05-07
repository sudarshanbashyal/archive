import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { pencilIcon } from 'src/assets/SVGs';
import { RootStore } from 'src/redux/store';
import Comment from './Comment';
import './comments.css';

interface readerCommentInterface {
    blogId: number;
}

export interface commentInterface {
    userId: number;
    profileImage: string | null;
    firstName: string;
    lastName: string;
    commentId: number;
    commentContent: string;
    likedBy: number[] | null;
    createdAt: string;
}

const Comments = ({ blogId }: readerCommentInterface) => {
    //
    const [currentComment, setCurrentComment] = useState<string>('');
    const [blogComments, setBlogComments] = useState<commentInterface[]>([]);

    const userState = useSelector((state: RootStore) => state.client);
    const accessToken = userState.client?.accessToken;

    const submitComment = async (e: any) => {
        e.preventDefault();

        const res = await fetch(`/blog/postComment/${blogId}`, {
            method: 'POST',
            headers: {
                authorization: `bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                commentContent: currentComment,
            }),
        });
        const data = await res.json();

        const newComment: commentInterface = {
            userId: data.comment.user_id,
            profileImage: data.comment.profileimage,
            firstName: data.comment.first_name,
            lastName: data.comment.last_name,
            commentId: data.comment.comment_id,
            commentContent: data.comment.comment_content,
            likedBy: data.comment.liked_by,
            createdAt: data.comment.created_at,
        };

        setBlogComments(blogComments => [newComment, ...blogComments]);

        setCurrentComment('');
    };

    useEffect(() => {
        setBlogComments([]);

        (async function getComments() {
            const res = await fetch(`/blog/getComments/${blogId}`);
            const data = await res.json();

            if (data.ok) {
                data.comments.map((comment: any) => {
                    setBlogComments(blogComments => [
                        {
                            userId: comment.user_id,
                            profileImage: comment.profileimage,
                            firstName: comment.first_name,
                            lastName: comment.last_name,
                            commentId: comment.comment_id,
                            commentContent: comment.comment_content,
                            likedBy: comment.liked_by,
                            createdAt: comment.created_at,
                        },
                        ...blogComments,
                    ]);
                });
            }
        })();
    }, []);

    return (
        <div className="comments-container ">
            <div className="comment-box">
                <form onSubmit={submitComment}>
                    <input
                        type="text"
                        placeholder="Add a comment"
                        onChange={e => {
                            setCurrentComment(e.target.value);
                        }}
                        value={currentComment}
                    />
                </form>

                <span onClick={submitComment}>{pencilIcon}</span>
            </div>

            {blogComments.map(com => (
                <Comment key={com.commentId} comment={com} />
            ))}
        </div>
    );
};

export default Comments;
