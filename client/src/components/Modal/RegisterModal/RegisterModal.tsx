import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSuccessToast } from 'src/components/Utils/ToastNotification';
import { closeModal } from 'src/redux/Actions/applicationActions';
// import { rightArrowIcon } from 'src/assets/SVGs';
import './registerModal.css';

interface registerData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    interest?: string;
    workplace?: string;
    bio?: string;
    topics: number[];
}

interface topicData {
    topic_id: number;
    topic_title: string;
    topic_image: string;
}

const RegisterModal = () => {
    const dispatch = useDispatch();

    const [formStage, setFormStage] = useState<number>(1);

    const [registerData, setRegisterData] = useState<registerData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        interest: '',
        workplace: '',
        bio: '',
        topics: [],
    });

    const [topics, setTopics] = useState<topicData[] | null>([]);

    const [error, setError] = useState('');

    const handleChange = (e: any) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const changeFormStage = () => {
        if (formStage === 1) {
            const {
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
            } = registerData;

            if (
                !firstName ||
                !lastName ||
                !email ||
                !password ||
                !confirmPassword
            ) {
                setError('Please fill out all the values.');
            } else if (password !== confirmPassword) {
                setError('The passwords do not match.');
            } else if (password.length < 6) {
                setError('The password must be at least 6 characters.');
            } else {
                setError('');
                setFormStage(formStage + 1);
            }
        } else if (formStage === 2) {
            setFormStage(formStage + 1);
        }
    };

    const toggleTopic = (topicId: number) => {
        if (registerData.topics.includes(topicId)) {
            setRegisterData({
                ...registerData,
                topics: registerData.topics.filter(topic => topic !== topicId),
            });
        } else {
            setRegisterData({
                ...registerData,
                topics: [...registerData.topics, topicId],
            });
        }
    };

    const handleSubmit = async (e: any) => {
        if (registerData.topics.length < 3) {
            setError('Please select at least 3 topics');
        } else {
            const res = await fetch('/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });
            const data = await res.json();

            if (!data.ok) {
                setError(data.error.message);
                setFormStage(1);
            }

            if (data.ok) {
                showSuccessToast('Account Successfully created!');
                dispatch(closeModal);
            }
        }
    };

    useEffect(() => {
        (async function getTopics() {
            const req = await fetch('/blog/getTopics');
            const data = await req.json();
            if (data.ok) {
                setTopics(data.data);
            }
        })();
    }, []);

    return (
        <div className="register-modal">
            <div
                className="form-progress-bar"
                style={{
                    width:
                        formStage === 1
                            ? '33%'
                            : formStage === 2
                            ? '66%'
                            : '100%',
                    borderRadius:
                        formStage === 3 ? '7px 7px 0px 0px' : '7px 0px 0px 0px',
                }}
            ></div>

            <div className="header">
                <span className="logo">A....</span>
                <svg
                    onClick={() => {
                        dispatch(closeModal);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                </svg>
            </div>

            {/* BASIC INFO SECTION */}

            {formStage === 1 ? (
                <div className="form-content">
                    <h1 className="form-title">Create a new account</h1>

                    <form>
                        <div className="basics">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={registerData.firstName}
                                onChange={handleChange}
                                maxLength={20}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={registerData.lastName}
                                onChange={handleChange}
                                maxLength={20}
                                required
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={registerData.email}
                            onChange={handleChange}
                            maxLength={40}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={registerData.password}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={registerData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </form>
                </div>
            ) : null}

            {/* MORE INFO SECTION */}

            {formStage === 2 ? (
                <div className="form-content">
                    <h1 className="form-title">Little more about you...</h1>

                    <form>
                        <input
                            type="text"
                            name="interest"
                            placeholder="Expertise/ Interest (Optional)"
                            value={registerData.interest}
                            onChange={handleChange}
                            maxLength={40}
                        />

                        <input
                            type="text"
                            name="workplace"
                            placeholder="Workplace (Optional)"
                            value={registerData.workplace}
                            onChange={handleChange}
                            maxLength={40}
                        />

                        <textarea
                            name="bio"
                            placeholder="How would you describe yourself? (Optional)"
                            rows={4}
                            value={registerData.bio}
                            onChange={handleChange}
                        ></textarea>
                        <span
                            className="textarea-length"
                            style={{
                                color:
                                    registerData.bio!.length > 200
                                        ? '#dd3b40'
                                        : 'black',
                            }}
                        >
                            {registerData.bio?.length}/200
                        </span>
                    </form>
                </div>
            ) : null}

            {/* TOPICS SECTION */}

            {formStage === 3 ? (
                <div className="form-content">
                    <h1 className="form-title">What fascinates you?</h1>
                    <p className="form-description">
                        Select at least 3 topics of your interest
                    </p>

                    <div className="topics-panel">
                        {topics!.map(topic => (
                            <div
                                key={topic.topic_id}
                                className={
                                    registerData.topics.includes(topic.topic_id)
                                        ? 'topic selected-topic'
                                        : 'topic'
                                }
                                onClick={() => {
                                    toggleTopic(topic.topic_id);
                                }}
                            >
                                <div className="topic-image">
                                    <img
                                        src={`${topic.topic_image}.jpg`}
                                        alt={topic.topic_title}
                                    />
                                </div>
                                <span className="topic-title">
                                    {topic.topic_title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

            {/* FORM BUTTONS */}

            {error && <span className="form-error">{error}</span>}

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
                        disabled={registerData.bio!.length > 200}
                        onClick={changeFormStage}
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
