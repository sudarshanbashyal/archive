import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logoutIcon } from 'src/assets/SVGs';
import { closeModal } from 'src/redux/Actions/applicationActions';
import { logOutUser } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import './logoutModal.css';
import { animationPrefixes } from '../ModalContainer';

const LogoutModal = () => {
    const dispatch = useDispatch();
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    const history = useHistory();

    return (
        <motion.div
            className={
                'logout-modal ' +
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
            <div className="icon-section">{logoutIcon}</div>

            <div className="content-section">
                <h2>Are you sure you want to log out?</h2>
                <p>
                    You will have to enter the credentials again before you can
                    log back in.
                </p>

                <button
                    className="logout-btn"
                    onClick={() => {
                        dispatch(logOutUser);
                        dispatch(closeModal);
                    }}
                >
                    Log Out
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

export default LogoutModal;
