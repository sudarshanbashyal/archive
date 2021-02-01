import React, { useState } from 'react';
import { rightArrowIcon } from 'src/assets/SVGs';
import './registerModal.css';

const RegisterModal = () => {
    const [formStage, setFormStage] = useState<number>(1);

    const handleSubmit = (e: any) => {
        e.preventDefault();
    };

    return (
        <div className="register-modal">
            <div
                className="form-progress-bar"
                style={{
                    width:
                        formStage == 1
                            ? '33%'
                            : formStage == 2
                            ? '66%'
                            : '100%',
                    borderRadius:
                        formStage == 3 ? '7px 7px 0px 0px' : '7px 0px 0px 0px',
                }}
            ></div>

            <div className="header">
                <span className="logo">A....</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                </svg>
            </div>

            {formStage == 1 ? (
                <div className="form-content">
                    <h1 className="form-title">Create a new account</h1>

                    <form>
                        <div className="basics">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                        />
                    </form>
                </div>
            ) : null}

            {formStage === 2 ? (
                <div className="form-content">
                    <h1 className="form-title">Little more about you...</h1>

                    <form>
                        <input
                            type="text"
                            name="interest"
                            placeholder="Expertise/ Interest (Optional)"
                        />

                        <input
                            type="text"
                            name="workplace"
                            placeholder="Workplace (Optional)"
                        />

                        <textarea
                            name="bio"
                            placeholder="How would you describe yourself? (Optional)"
                            rows={8}
                        ></textarea>
                    </form>
                </div>
            ) : null}

            {formStage === 3 ? (
                <div className="form-content">
                    <h1 className="form-title">What fascinates you?</h1>
                </div>
            ) : null}

            <div className="form-controls">
                <button
                    className="back-btn"
                    disabled={formStage < 2}
                    onClick={() => {
                        setFormStage(formStage - 1);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                    </svg>{' '}
                    Back
                </button>

                {formStage < 3 ? (
                    <button
                        className="next-btn"
                        onClick={() => {
                            setFormStage(formStage + 1);
                        }}
                    >
                        Next
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                        </svg>
                    </button>
                ) : (
                    <button className="next-btn" onClick={handleSubmit}>
                        Finish
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default RegisterModal;
