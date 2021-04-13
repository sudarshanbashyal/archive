import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';
import { infoUserInterface } from './InfoModal';

const UsersInfoContainer = ({ users }: { users: infoUserInterface[] }) => {
    const userState = useSelector((state: RootStore) => state.client);
    const dispatch = useDispatch();

    return (
        <div className="users-container">
            {users.length === 0 ? (
                <h2 className="no-users">No users found!</h2>
            ) : (
                users.map((user: infoUserInterface) => (
                    <div key={user.userId} className="user">
                        <div className="user-profile"></div>
                        <div className="user-detail">
                            {user.firstName} {user.lastName}
                        </div>

                        {/* check if the current user is followed by our user and display follow buttons accordingly */}
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
                ))
            )}
        </div>
    );
};

export default UsersInfoContainer;
