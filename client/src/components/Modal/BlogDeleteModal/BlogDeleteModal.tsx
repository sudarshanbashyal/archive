import React from 'react';
import './blogDeleteModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { animationPrefixes } from '../ModalContainer';
import { closeModal } from 'src/redux/Actions/applicationActions';
import { RootStore } from 'src/redux/store';
import { trashIcon } from 'src/assets/SVGs';
import { useHistory } from 'react-router-dom';
import {
    showFailureToast,
    showSuccessToast,
} from 'src/components/Utils/ToastNotification';

const BlogDeleteModal = () => {
    const dispatch = useDispatch();
    const userState = useSelector((state: RootStore) => state.client);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    const currentURL = window.location.href;
    const urlElements = currentURL.split('/');
    const blogId = +urlElements[urlElements.length - 1];

    const deleteBlog = async () => {
        const res = await fetch(`/blog/deleteBlog/${blogId}`, {
            headers: {
                authorization: `bearer ${
                    userState && userState.client?.accessToken
                }`,
            },
        });

        const data = await res.json();
        if (data.ok) {
            window.location.replace(
                `/user/${userState && userState.client?.profile.userId}`
            );
            showSuccessToast('Blog Successfully Removed!');
        } else {
            showFailureToast('Something went wrong! Please try again.');
        }
    };

    return (
        <motion.div
            className={
                'blog-delete-modal ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'logout-modal-dark'
                    : '')
            }
            initial={animationPrefixes.initial}
            animate={animationPrefixes.animate}
            transition={animationPrefixes.transition}
            exit={animationPrefixes.exit}
        >
            <div className="icon-section">{trashIcon}</div>

            <div className="content-section">
                <h2>Are you sure you want to delete this blog?</h2>
                <p>
                    You will not be able to retrieve this blog after you delete
                    it.
                </p>

                <button className="delete-btn" onClick={deleteBlog}>
                    Delete Blog
                </button>
                <button
                    className="cancel-btn"
                    onClick={() => {
                        dispatch(closeModal);
                    }}
                >
                    Cancel
                </button>
            </div>
        </motion.div>
    );
};

export default BlogDeleteModal;
