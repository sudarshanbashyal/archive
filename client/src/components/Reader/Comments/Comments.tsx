import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { pencilIcon } from 'src/assets/SVGs';
import { showSuccessToast } from 'src/components/Utils/ToastNotification';
import { RootStore } from 'src/redux/store';
import Comment from './Comment';
import './comments.css';

interface readerCommentInterface {
    blogId: number;
    blogAuthorId: number;
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

const Comments = ({ blogId, blogAuthorId }: readerCommentInterface) => {
    //
    const [currentComment, setCurrentComment] = useState<string>('');
    const [blogComments, setBlogComments] = useState<commentInterface[]>([]);

    const userState = useSelector((state: RootStore) => state.client);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

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
                parentId: null,
            }),
        });
        const data = await res.json();

        if (data.ok) {
            const newComment: commentInterface = data.comment;
            setBlogComments(blogComments => [newComment, ...blogComments]);

            setCurrentComment('');
        }
    };

    const deleteComment = async (commentId: number) => {
        const res = await fetch(`/blog/deleteComment/${commentId}`, {
            headers: {
                authorization: `bearer ${accessToken}`,
            },
        });

        const data = await res.json();
        if (data.ok) {
            setBlogComments(blogComments =>
                blogComments.filter(comment => comment.commentId !== commentId)
            );
            showSuccessToast('Comment Removed!');
        }
    };

    useEffect(() => {
        setBlogComments([]);

        (async function getComments() {
            const res = await fetch(`/blog/getComments/${blogId}`);
            const data = await res.json();

            if (data.ok) {
                setBlogComments(data.comments);
            }
        })();
    }, []);

    return (
        <div
            className={
                'comments-container ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'comments-container-dark'
                    : '')
            }
        >
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
                <Comment
                    key={com.commentId}
                    comment={com}
                    blogAuthorId={blogAuthorId}
                    blogId={blogId}
                    deleteComment={deleteComment}
                />
            ))}
        </div>
    );
};

export default Comments;
