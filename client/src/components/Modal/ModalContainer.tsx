import React from 'react';
import { useSelector } from 'react-redux';
import { RootStore } from 'src/redux/store';
import LogoutModal from './LogoutModal/LogoutModal';
import RegisterModal from './RegisterModal/RegisterModal';
import './modalContainer.css';
import ConfirmModal from './ConfirmModal/ConfirmModal';
import InfoModal from './InfoModal/InfoModal';

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
            ) : applicationState.modal?.modalType === 'following' ? (
                <InfoModal infoType="Following" />
            ) : applicationState.modal?.modalType === 'followers' ? (
                <InfoModal infoType="Followers" />
            ) : null}
        </div>
    );
};

export default ModalContainer;
