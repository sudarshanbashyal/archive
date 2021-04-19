import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { closeIcon, pencilIcon } from 'src/assets/SVGs';
import { RootStore } from 'src/redux/store';
import './comments.css';

interface readerCommentInterface {
    blogId: number;
    commentExpanded: boolean;
    setCommentExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const Comments = ({
    blogId,
    commentExpanded,
    setCommentExpanded,
}: readerCommentInterface) => {
    //
    const [currentComment, setCurrentComment] = useState<string>('');
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
        console.log(data);

        setCurrentComment('');
    };

    useEffect(() => {
        console.log('fetching comments');
    }, []);

    return (
        <div
            className={
                'comments-container ' +
                (commentExpanded && ' expanded-comment-container')
            }
        >
            <span
                className="close-icon"
                onClick={() => {
                    setCommentExpanded(false);
                }}
            >
                {closeIcon}
            </span>

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
        </div>
    );
};

export default Comments;
