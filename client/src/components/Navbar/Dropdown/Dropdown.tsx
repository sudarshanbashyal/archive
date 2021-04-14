import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { openModal } from 'src/redux/Actions/applicationActions';
import { RootStore } from 'src/redux/store';
import './dropdown.css';

const Dropdown = () => {
    const dispatch = useDispatch();
    const userState = useSelector((state: RootStore) => state.client);

    const dropdownLinks = [
        {
            title: 'Profile',
            to: `/user/${userState && userState.client?.profile.userId}`,
        },
        { title: 'My Blogs', to: '/' },
        { title: 'Bookmarks', to: '/' },
        { title: 'Settings', to: '/settings' },
    ];

    return (
        <div className="dropdown">
            <div className="profile">
                <div className="user-info">
                    <p className="user-name">
                        {userState && userState.client?.profile.firstName}{' '}
                        {userState && userState.client?.profile.lastName}
                    </p>
                    <p className="user-interest">
                        {userState && userState.client?.profile?.interest}
                    </p>
                </div>
            </div>

            <hr />

            <ul className="dropdown-links">
                {dropdownLinks.map(link => (
                    <li key={link.title}>
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

            <button
                className="sign-out"
                onClick={() => {
                    dispatch(openModal('logout'));
                }}
            >
                Sign out
            </button>
        </div>
    );
};

export default Dropdown;
