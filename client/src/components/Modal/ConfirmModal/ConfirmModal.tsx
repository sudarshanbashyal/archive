import React from 'react';
import { useDispatch } from 'react-redux';
import { checkmarkIcon } from 'src/assets/SVGs';
import { closeModal } from 'src/redux/Actions/applicationActions';
import './confirmModal.css';

const ConfirmModal = () => {
    const dispatch = useDispatch();

    return (
        <div className="confirm-modal">
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
