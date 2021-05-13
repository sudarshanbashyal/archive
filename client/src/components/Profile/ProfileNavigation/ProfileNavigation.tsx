import React from 'react';
import './profileNavigation.css';
import { ProfileNavigationType } from '../Profile';
import { useSelector } from 'react-redux';
import { RootStore } from 'src/redux/store';

const ProfileNavigation = ({
    currentProfileNavigation,
    setCurrentProfileNavigation,
}: {
    currentProfileNavigation: ProfileNavigationType;
    setCurrentProfileNavigation: React.Dispatch<
        React.SetStateAction<ProfileNavigationType>
    >;
}) => {
    const changeProfileNavigation = (e: any) => {
        setCurrentProfileNavigation(e.target.id);
    };

    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    return (
        <div
            className={
                'profile-navigation ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'profile-navigation-dark'
                    : '')
            }
        >
            <ul>
                <li
                    className={
                        currentProfileNavigation === 'blogs'
                            ? 'active-navigation'
                            : ''
                    }
                    id="blogs"
                    onClick={changeProfileNavigation}
                >
                    Blogs
                </li>

                <li
                    className={
                        currentProfileNavigation === 'bookmarks'
                            ? 'active-navigation'
                            : ''
                    }
                    id="bookmarks"
                    onClick={changeProfileNavigation}
                >
                    Bookmarks
                </li>

                <li
                    className={
                        currentProfileNavigation === 'drafts'
                            ? 'active-navigation'
                            : ''
                    }
                    id="drafts"
                    onClick={changeProfileNavigation}
                >
                    Drafts
                </li>
            </ul>
        </div>
    );
};

export default ProfileNavigation;
