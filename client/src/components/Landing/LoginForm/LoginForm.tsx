import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from 'src/redux/Actions/applicationActions';
import { loginUser } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';

const LoginForm = () => {
    const userState = useSelector((state: RootStore) => state.client);
    const dispatch = useDispatch();

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: any) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        dispatch(loginUser(loginData));
    };

    const openRegisterModal = () => {
        dispatch(openModal('register'));
    };

    return (
        <div className="form-container">
            <span className="form-logo">A....</span>
            <h1 className="form-title">Read. Write. Share</h1>

            {/* Login Form */}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                />
                <span className="error-message">
                    {userState && userState.error}
                </span>
                <button className="sign-in-btn">Sign In</button>
                <span className="register-link" onClick={openRegisterModal}>
                    Not a member yet? Register here.
                </span>
            </form>
        </div>
    );
};

export default LoginForm;
