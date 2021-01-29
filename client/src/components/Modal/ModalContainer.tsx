import React from 'react';
import './modalContainer.css';
import RegisterModal from './RegisterModal/RegisterModal';

const ModalContainer = () => {
    return (
        <div className="modal-container">
            <RegisterModal />
        </div>
    );
};

export default ModalContainer;
