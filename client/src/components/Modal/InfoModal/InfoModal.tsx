import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeIcon } from 'src/assets/SVGs';
import { closeModal } from 'src/redux/Actions/applicationActions';
import { followUser, unfollowUser } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import './infoModal.css';

interface infoUserInterface {
    userId: number;
    firstName: string;
    lastName: string;
    profileImage: string | undefined | null;
}

const InfoModal = ({ infoType }: { infoType: String }) => {
    const currentURL = window.location.href;
    const userState = useSelector((state: RootStore) => state.client);

    const profileId = +currentURL.charAt(currentURL.length - 1);
    const infoEndPoint =
        infoType === 'Following'
            ? `/user/getFollowing/${profileId}`
            : `/user/getFollowers/${profileId}`;

    const [users, setUsers] = useState<infoUserInterface[]>([]);

    const dispatch = useDispatch();

    const [currentInfo, setCurrentInfo] = useState('People');

    useEffect(() => {
        (async function getUsers() {
            //
            const res = await fetch(infoEndPoint);
            const data = await res.json();

            if (data.ok) {
                data.profileUsers.forEach((u: any) => {
                    const newUser: infoUserInterface = {
                        userId: u.user_id,
                        firstName: u.first_name,
                        lastName: u.last_name,
                        profileImage: u.profileImage,
                    };
                    setUsers(users => [...users, newUser]);
                });
            }
            console.log(users);
            //
        })();
    }, []);

    return (
        <div className="info-modal">
            <span
                onClick={() => {
                    dispatch(closeModal);
                }}
            >
                {closeIcon}
            </span>
            <h3 className="info-title">{infoType}</h3>

            {infoType === 'Following' ? (
                <div className="info-navigation">
                    <div
                        className={
                            'info-topic ' +
                            (currentInfo === 'People' ? 'active-topic' : '')
                        }
                    >
                        <span
                            className="topic-title"
                            onClick={() => {
                                setCurrentInfo('People');
                            }}
                        >
                            People
                        </span>
                    </div>
                    <div
                        className={
                            'info-topic ' +
                            (currentInfo === 'Topic' ? 'active-topic' : '')
                        }
                    >
                        <span
                            className="topic-title"
                            onClick={() => {
                                setCurrentInfo('Topic');
                            }}
                        >
                            Topics
                        </span>
                    </div>
                </div>
            ) : null}

            <div className="users-container">
                {users.map(user => (
                    <div key={user.userId} className="user">
                        <div className="user-profile"></div>
                        <div className="user-detail">
                            {user.firstName} {user.lastName}
                        </div>
                        {userState &&
                        userState.client?.profile.usersFollowed.includes(
                            user.userId
                        ) ? (
                            <button
                                onClick={() => {
                                    dispatch(
                                        unfollowUser(
                                            user.userId,
                                            userState &&
                                                userState.client?.accessToken
                                        )
                                    );
                                }}
                                className="follow-btn"
                            >
                                Following
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    dispatch(
                                        followUser(
                                            user.userId,
                                            userState &&
                                                userState.client?.accessToken
                                        )
                                    );
                                }}
                                className="follow-btn"
                            >
                                Follow
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoModal;
