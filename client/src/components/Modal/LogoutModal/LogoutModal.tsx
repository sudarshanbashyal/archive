import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logoutIcon } from 'src/assets/SVGs';
import { closeModal } from 'src/redux/Actions/applicationActions';
import { logOutUser } from 'src/redux/Actions/userActions';
import './logoutModal.css';

const LogoutModal = () => {
    const dispatch = useDispatch();

    const history = useHistory();

    return (
        <div className="logout-modal">
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
        </div>
    );
};

export default LogoutModal;
