import React from 'react';
import './recommendations.css';

const Recommendations = () => {
    const userArray = [
        {
            userName: 'Carson Turner',
            userJob: 'Software Enginner, Microsoft',
        },

        {
            userName: 'Carson Turner',
            userJob: 'Software Enginner, Microsoft',
        },

        {
            userName: 'Carson Turner',
            userJob: 'Software Enginner, Microsoft',
        },
    ];

    return (
        <div className="recommendations">
            <h2>people you might want to follow</h2>

            <div className="users">
                {userArray.map((user, index) => (
                    <div key={index} className="user">
                        <div className="user-container">
                            <div className="user-profile"></div>
                            <div className="user-info">
                                <span className="user-name">
                                    {user.userName}
                                </span>{' '}
                                <br />
                                <span>{user.userJob}</span>
                            </div>
                        </div>
                        <button className="follow-btn">Follow</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;
