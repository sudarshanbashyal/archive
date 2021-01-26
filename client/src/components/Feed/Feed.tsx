import React from 'react';
import Blogs from './Blogs/Blogs';
import './feed.css';
import Recommendations from './Recommendations/Recommendations';

const Feed = () => {
    return (
        <div className="feed">
            <div className="header">
                <h1>
                    Good Afternoon, <br /> Andrew...
                </h1>
                <p>Hope you have a good read today!</p>

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
    );
};

export default Feed;
