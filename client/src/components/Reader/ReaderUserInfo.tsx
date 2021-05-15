import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from 'src/redux/Actions/userActions';
import { RootStore } from 'src/redux/store';

interface readerUserInterface {
    userId: number;
    firstName: string;
    lastName: string;
    interest: string | null;
    profileImage: string | null;
}

const ReaderUserInfo = ({
    userId,
    firstName,
    lastName,
    interest,
    profileImage,
}: readerUserInterface) => {
    const userState = useSelector((state: RootStore) => state.client);
    const dispatch = useDispatch();

    return (
        <div className="reader-user-container">
            <h3 className="user-name">
                {firstName} {lastName}
            </h3>

            {userState.client?.profile.userId !== userId ? (
                <div>
                    {userState.client?.profile.usersFollowed.includes(
                        userId
                    ) ? (
                        <button
                            onClick={() => {
                                dispatch(
                                    unfollowUser(
                                        +userId,
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
                                        +userId,
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
            ) : null}
        </div>
    );
};

export default ReaderUserInfo;
