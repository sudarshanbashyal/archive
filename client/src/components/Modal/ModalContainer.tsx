import React from 'react';
import { useSelector } from 'react-redux';
import { RootStore } from 'src/redux/store';
import LogoutModal from './LogoutModal/LogoutModal';
import RegisterModal from './RegisterModal/RegisterModal';
import './modalContainer.css';
import ConfirmModal from './ConfirmModal/ConfirmModal';

const ModalContainer = () => {
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    return (
        <div className="modal-container">
            {applicationState &&
            applicationState.modal?.modalType === 'register' ? (
                <RegisterModal />
            ) : applicationState.modal?.modalType === 'logout' ? (
                <LogoutModal />
            ) : applicationState.modal?.modalType === 'uploadBlog' ? (
                <ConfirmModal />
            ) : null}
        </div>
    );
};

export default ModalContainer;
