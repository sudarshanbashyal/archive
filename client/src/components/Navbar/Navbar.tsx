import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { bookmarkStrokeIcon, exploreIcon, pencilIcon } from 'src/assets/SVGs';
import { RootStore } from 'src/redux/store';
import Dropdown from './Dropdown/Dropdown';
import './navbar.css';

const Navbar = () => {
    const [dropdown, setDropdown] = useState<boolean>(false);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );
    const userState = useSelector((state: RootStore) => state.client);

    // get current route
    const currentRoute = useLocation();

    // set dropdown to false on route change
    useEffect(() => {
        setDropdown(false);
    }, [currentRoute.pathname, applicationState.modal?.modalOpen]);

    // array of nav-items
    const navbarLinks = [
        {
            link: '/editor',
            icon: pencilIcon,
        },
        {
            link: '/explore',
            icon: exploreIcon,
        },
        {
            link: `/user/bookmarks/${
                userState && userState.client?.profile.userId
            }`,
            icon: bookmarkStrokeIcon,
        },
    ];

    return (
        <div
            className={
                'navbar ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'navbar-dark'
                    : '')
            }
        >
            <div className="nav-container">
                <div className="logo">
                    <Link style={{ textDecoration: 'none' }} to="/">
                        <div>Archive.</div>
                    </Link>
                </div>

                <div className="nav-items">
                    {navbarLinks.map(navbarLink => (
                        <Link key={navbarLink.link} to={navbarLink.link}>
                            {navbarLink.icon}
                        </Link>
                    ))}

                    <div
                        className="nav-profile-picture"
                        onMouseEnter={() => {
                            setDropdown(true);
                        }}
                        onMouseLeave={() => {
                            setDropdown(false);
                        }}
                    >
                        <img
                            src={
                                userState &&
                                userState.client?.profile.profileImage
                                    ? userState.client?.profile.profileImage
                                    : 'https://www.pngitem.com/pimgs/m/150-1503941_user-windows-10-user-icon-png-transparent-png.png'
                            }
                            alt=""
                        />
                    </div>
                </div>

                {dropdown && (
                    <div className="navbar-dropdown">
                        <Dropdown
                            dropdown={dropdown}
                            setDropdown={setDropdown}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
