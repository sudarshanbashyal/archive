import React from 'react';
import './landing.css';
import typewriter from '../../assets/images/typewriter.png';
import yellowSwiggle from '../../assets/yellow-swiggle.svg';
import redSwiggle from '../../assets/red-swiggle.svg';
import whiteSwiggle from '../../assets/white-swiggle.svg';
import formSwiggle from '../../assets/form-red-swiggle.svg';
import LoginForm from './LoginForm/LoginForm';

const Landing = () => {
    return (
        <div className="landing">
            <div className="image-section">
                <h3 className="logo-gradient">Archive.</h3>
                <img
                    className="swiggle yellow-swiggle"
                    src={yellowSwiggle}
                    alt="decoration"
                />
                <img
                    className="swiggle white-swiggle"
                    src={whiteSwiggle}
                    alt="decoration"
                />
                <img
                    className="swiggle red-swiggle"
                    src={redSwiggle}
                    alt="decoration"
                />
            </div>

            <div className="login-section">
                <LoginForm />

                <img
                    className="swiggle form-swiggle"
                    src={formSwiggle}
                    alt="decoration"
                />
            </div>

            <img className="typewriter" src={typewriter} alt="" />
        </div>
    );
};

export default Landing;
