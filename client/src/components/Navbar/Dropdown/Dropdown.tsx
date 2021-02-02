import React from 'react';
import { Link } from 'react-router-dom';
import './dropdown.css';

const Dropdown = () => {
    const dropdownLinks = [
        { title: 'Profile', to: '/profile/123' },
        { title: 'My Blogs', to: '/' },
        { title: 'Bookmarks', to: '/' },
        { title: 'Settings', to: '/settings' },
    ];

    return (
        <div className="dropdown">
            <div className="profile">
                <div className="user-info">
                    <p className="user-name">Carson Turner</p>
                    <p className="user-interest">Software Engineer</p>
                </div>
            </div>

            <hr />

            <ul className="dropdown-links">
                {dropdownLinks.map((link) => (
                    <li>
                        <Link
                            style={{ textDecoration: 'none', color: 'black' }}
                            to={link.to}
                        >
                            {link.title}
                        </Link>
                    </li>
                ))}
            </ul>

            <hr />

            <button className="sign-out">Sign out</button>
        </div>
    );
};

export default Dropdown;
