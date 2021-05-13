import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { defaultProfileImage } from 'src/assets/SVGs';
import { unfollowUser, followUser } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import './recommendations.css';

interface recommendUsersInterface {
    userId: number;
    firstName: string;
    lastName: string;
    interest: string | null;
    workplace: string | null;
    profileImage: string | null;
}

const Recommendations = () => {
    const dispatch = useDispatch();

    const applicationState = useSelector(
        (state: RootStore) => state.application
    );
    const userState = useSelector((state: RootStore) => state.client);

    const [recommendedUsers, setRecommendedUsers] = useState<
        recommendUsersInterface[]
    >([]);

    useEffect(() => {
        const usersFollowed =
            userState && userState.client?.profile.usersFollowed.toString();

        (async function recommendUsers() {
            const res = await fetch(`/user/recommendUsers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usersFollowed,
                    userId: userState && userState.client?.profile.userId,
                }),
            });

            const data = await res.json();
            if (data.ok) {
                setRecommendedUsers(data.users);
            }
        })();
    }, []);

    return recommendedUsers[0] ? (
        <div
            className={
                'recommendations ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'recommendations-dark'
                    : '')
            }
        >
            <h2>people you might want to follow</h2>

            <div className="users">
                {recommendedUsers.map((user, index) => (
                    <div key={index} className="user">
                        <div className="user-container">
                            <div className="user-profile">
                                <img
                                    src={
                                        user.profileImage || defaultProfileImage
                                    }
                                    alt=""
                                />
                            </div>

                            <div className="user-info">
                                <Link
                                    className="link"
                                    to={`/user/${user.userId}`}
                                >
                                    <span className="user-name">
                                        {user.firstName} {user.lastName}
                                    </span>{' '}
                                </Link>

                                <br />
                                <span>{user.interest || ''}</span>
                            </div>
                        </div>

                        {userState &&
                        userState.client?.profile.usersFollowed.includes(
                            user.userId
                        ) ? (
                            <button
                                className="follow-btn"
                                onClick={() => {
                                    dispatch(
                                        unfollowUser(
                                            user.userId,
                                            userState &&
                                                userState.client?.accessToken
                                        )
                                    );
                                }}
                            >
                                Following
                            </button>
                        ) : (
                            <button
                                className="follow-btn"
                                onClick={() => {
                                    dispatch(
                                        followUser(
                                            user.userId,
                                            userState &&
                                                userState.client?.accessToken
                                        )
                                    );
                                }}
                            >
                                Follow
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    ) : null;
};

export default Recommendations;
