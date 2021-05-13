import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkmarkIcon } from 'src/assets/SVGs';
import { closeModal } from 'src/redux/Actions/applicationActions';
import { RootStore } from 'src/redux/store';
import './confirmModal.css';

const ConfirmModal = () => {
    const dispatch = useDispatch();
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    return (
        <div
            className={
                'confirm-modal ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'confirm-modal-dark'
                    : '')
            }
        >
            <div className="icon-section">{checkmarkIcon}</div>
            <div className="content-section">
                <h3>Are you sure you want to upload the blog?</h3>

                <button className="confirm-btn">Upload</button>
                <button
                    className="cancel-btn"
                    onClick={() => {
                        dispatch(closeModal);
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmModal;
