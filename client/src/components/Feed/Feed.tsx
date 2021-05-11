import React from 'react';
import { useSelector } from 'react-redux';
import { RootStore } from 'src/redux/store';
import Blogs from './Blogs/Blogs';
import './feed.css';
import Recommendations from './Recommendations/Recommendations';

const Feed = () => {
    const userState = useSelector((state: RootStore) => state.client);
    const currentTime = new Date().getHours();
    console.log(currentTime);

    let greeting;
    if (currentTime < 12) greeting = 'Morning,';
    else if (currentTime >= 12 && currentTime < 17) greeting = 'Day,';
    else if (currentTime >= 17 && currentTime < 20) greeting = 'Afternoon,';
    else greeting = 'Night,';

    return (
        <div className="outer-container">
            <div className="feed">
                <div className="header">
                    <h1>
                        Good {greeting} <br />
                        {userState && userState.client?.profile.firstName}...
                    </h1>
                    <p>Hope you have a good read!</p>

                    <button className="cta-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path d="M14.078 7.061l2.861 2.862-10.799 10.798-3.584.723.724-3.585 10.798-10.798zm0-2.829l-12.64 12.64-1.438 7.128 7.127-1.438 12.642-12.64-5.691-5.69zm7.105 4.277l2.817-2.82-5.691-5.689-2.816 2.817 5.69 5.692z" />
                        </svg>
                        Start Writing
                    </button>
                </div>

                <div className="content-section">
                    <div className="blog-section">
                        <Blogs />
                    </div>
                    <div className="recommendation-section">
                        <Recommendations />
                    </div>
                </div>
            </div>

            <div className="pattern-right"></div>
            <div className="pattern-left"></div>
        </div>
    );
};

export default Feed;
