import Express from 'express';
import { db } from '../database/db';
import bcrypt from 'bcrypt';
import {
    isAuth,
    createAccessToken,
    createRefreshToken,
    PayloadType,
} from '../utils/auth';
import { verify } from 'jsonwebtoken';
import { uploadImage } from '../utils/uploadImage';

const router = Express.Router();

router.post('/register', async (_req, _res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            interest,
            workplace,
            bio,
            topics,
        } = _req.body;

        // check if the user already exists
        const userExists = await db.query(
            `SELECT * FROM users WHERE email=$1`,
            [email]
        );

        if (userExists.rows[0]) {
            return _res.status(409).json({
                ok: false,
                error: {
                    message: 'User with the following email already exists.',
                },
            });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create the user
        const newUser = await db.query(
            `INSERT INTO users(first_name, last_name, email, password, interest, workplace, bio, topics_followed) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                firstName,
                lastName,
                email,
                hashedPassword,
                interest,
                workplace,
                bio,
                `{${topics.toString()}}`,
            ]
        );

        if (newUser.rows[0]) {
            return _res.status(201).json({
                ok: true,
                user: newUser,
            });
        } else {
            return _res.status(500).json({
                ok: false,
                error: {
                    message: 'Could not create a user, Please try again.',
                },
            });
        }
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.post('/login', async (_req, _res) => {
    try {
        const { email, password } = _req.body;

        // check if user exists
        const user = await db.query(`SELECT * FROM users WHERE email=$1`, [
            email,
        ]);
        if (!user.rows[0]) {
            return _res.status(401).json({
                ok: false,
                error: {
                    message: 'Invalid email or password.',
                },
            });
        }

        // check password
        const userPassword = user.rows[0].password;
        const passwordMatch = await bcrypt.compare(password, userPassword);

        if (!passwordMatch) {
            return _res.status(401).json({
                ok: false,
                error: {
                    message: 'Invalid email or password.',
                },
            });
        }

        // deliver refresh token in client's cookie
        _res.cookie('authId', createRefreshToken(user.rows[0]), {
            httpOnly: true, // cannot be accessed by client javascript
        });

        const {
            user_id,
            first_name,
            last_name,
            interest,
            workplace,
            bio,
            users_followed,
            topics_followed,
            profileimage,
            headerimage,
            bookmarks,
        } = user.rows[0];

        return _res.json({
            ok: true,
            accessToken: createAccessToken(user.rows[0]),
            user: {
                userId: user_id,
                firstName: first_name,
                lastName: last_name,
                email: user.rows[0]['email'],
                interest,
                workplace,
                bio,
                usersFollowed: users_followed,
                topicsFollowed: topics_followed,
                profileImage: profileimage,
                headerImage: headerimage,
                bookmarks: bookmarks,
            },
        });
        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.post('/refreshToken', async (_req, _res) => {
    try {
        const token = _req.cookies.authId;
        if (!token) {
            return _res.status(401).json({
                ok: false,
                error: {
                    message: 'Access Denied.',
                },
            });
        }

        try {
            const payload: any = verify(
                token,
                process.env.REFRESH_TOKEN_SECRET!
            );

            const user = await db.query(
                `SELECT * FROM users WHERE user_id=$1`,
                [payload.userId]
            );

            if (!user.rows[0]) {
                return _res.status(401).json({
                    ok: false,
                    error: {
                        message: 'Could not find a user.',
                    },
                });
            }

            // deliver refresh token in client's cookie
            _res.cookie('authId', createRefreshToken(user.rows[0]), {
                httpOnly: true, // cannot be accessed by client javascript
            });

            const {
                user_id,
                first_name,
                last_name,
                interest,
                workplace,
                bio,
                users_followed,
                topics_followed,
                profileimage,
                headerimage,
                bookmarks,
            } = user.rows[0];

            return _res.json({
                ok: true,
                accessToken: createAccessToken(user.rows[0]),
                user: {
                    userId: user_id,
                    firstName: first_name,
                    lastName: last_name,
                    email: user.rows[0]['email'],
                    interest,
                    workplace,
                    bio,
                    usersFollowed: users_followed,
                    topicsFollowed: topics_followed,
                    profileImage: profileimage,
                    headerImage: headerimage,
                    bookmarks: bookmarks,
                },
            });

            //
        } catch (err) {
            return _res.status(401).json({
                ok: false,
                error: {
                    message: 'Could not verify token.',
                    err,
                },
            });
        }

        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.get('/clearToken', async (_req, _res) => {
    try {
        _res.cookie('authId', null, { httpOnly: true });
        return _res.json({
            ok: true,
            message: 'Successfully logged out',
        });

        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.post('/updateUserProfile', isAuth, async (_req: PayloadType, _res) => {
    try {
        const { firstName, lastName, interest, workplace, bio } = _req.body;

        const userId = _req.userId;
        const user = await db.query(
            `UPDATE users SET first_name=$1, last_name=$2, interest=$3, workplace=$4, bio=$5 WHERE user_id=$6 RETURNING *`,
            [firstName, lastName, interest, workplace, bio, userId]
        );

        return _res.status(201).json({
            ok: true,
            user: {
                firstName: user.rows[0].first_name,
                lastName: user.rows[0].last_name,
                interest: user.rows[0].interest,
                workplace: user.rows[0].workplace,
                bio: user.rows[0].bio,
            },
        });
        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.post('/updateUserAccount', isAuth, async (_req: PayloadType, _res) => {
    try {
        const { email, currentPassword, newPassword } = _req.body;

        const userId = _req.userId;
        const user = await db.query('SELECT * FROM users WHERE user_id=$1', [
            userId,
        ]);

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.rows[0].password
        );
        if (!passwordMatch) {
            return _res.status(401).json({
                ok: false,
                error: {
                    message: 'Incorrect credentials.',
                },
            });
        }

        // change just the email if no new password is given
        if (!newPassword) {
            let updatedUser = await db.query(
                'UPDATE users SET email=$1 WHERE user_id=$2 RETURNING email',
                [email, userId]
            );

            return _res.status(201).json({
                ok: true,
                user: updatedUser.rows[0],
            });
        }

        // hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // ---- TODO ----
        // - Handle unique email warning
        let updatedUser = await db.query(
            'UPDATE users SET email=$1, password=$2 WHERE user_id=$3 RETURNING email',
            [email, hashedPassword, userId]
        );

        return _res.json({
            ok: true,
            user: updatedUser.rows[0],
        });

        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.get('/getUser/:id', async (_req, _res) => {
    try {
        const profileId = _req.params.id;

        const user = await db.query(
            `SELECT 
                u.first_name, 
                u.last_name, 
                u.interest, 
                u.workplace, 
                u.users_followed,
                u.topics_followed,
                u.headerImage,
                u.profileImage,
                b.blog_id,
                b.title,
                b.likes,
                b.header_image,
                b.created_at,
                t.topic_title
            FROM users u
            LEFT OUTER JOIN blogs b ON u.user_id = b.creator_id
            LEFT OUTER JOIN topics t ON b.topic_id = t.topic_id
            WHERE u.user_id=$1;`,
            [profileId]
        );

        const followersQuery = await db.query(
            `SELECT user_id FROM users WHERE ARRAY[${profileId}] && users_followed;`
        );

        if (!user.rows[0]) {
            return _res.status(404).json({
                ok: false,
                error: {
                    message: 'User not found.',
                },
            });
        }
        return _res.json({
            ok: true,
            info: user.rows,
            followers: followersQuery.rows,
        });
        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.get('/followUser/:id', isAuth, async (_req: PayloadType, _res) => {
    try {
        const profileId = _req.params.id;

        const user = _req.userId;
        const newFollowArray = await db.query(
            `
            UPDATE users
            SET users_followed=array_append(users_followed, $1)
            WHERE user_id=$2
            RETURNING users_followed;`,
            [profileId, user]
        );

        return _res.status(201).json({
            ok: true,
            newList: newFollowArray.rows[0].users_followed,
        });
        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.get('/unfollowUser/:id', isAuth, async (_req: PayloadType, _res) => {
    try {
        const profileId = _req.params.id;

        const user = _req.userId;
        const newFollowArray = await db.query(
            `
            UPDATE users
            SET users_followed=array_remove(users_followed, $1)
            WHERE user_id=$2
            RETURNING users_followed;`,
            [profileId, user]
        );

        return _res.status(201).json({
            ok: true,
            newList: newFollowArray.rows[0].users_followed,
        });
        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.get('/getFollowing/:id', async (_req, _res) => {
    try {
        const userId = +_req.params.id;
        const followingQuery = await db.query(
            `SELECT users_followed FROM users WHERE user_id=${userId}`
        );

        if (!followingQuery) {
            return _res.status(500).json({
                ok: false,
                error: {
                    message: 'Something went wrong.',
                },
            });
        }
        const queryArray = followingQuery.rows[0].users_followed.toString();

        const queryUsers = await db.query(
            `SELECT
            user_id,
            first_name,
            last_name,
            profileImage
            FROM users WHERE user_id IN (${queryArray});`
        );

        if (!queryUsers) {
            return _res.status(500).json({
                ok: false,
                error: {
                    message: 'Something went wrong.',
                },
            });
        }

        return _res.json({
            ok: true,
            profileUsers: queryUsers.rows,
        });

        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.get('/getFollowers/:id', async (_req, _res) => {
    try {
        const userId = parseInt(_req.params.id);

        const queryUsers = await db.query(
            `SELECT user_id, first_name, last_name, profileImage FROM users WHERE ARRAY[${userId}] && users_followed;`
        );

        if (queryUsers === undefined || queryUsers === null) {
            return _res.json({
                ok: false,
                message: 'no users found',
            });
        }

        return _res.json({
            ok: true,
            profileUsers: queryUsers.rows,
        });
        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.post('/updateProfileImage', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;

        const { encodedImage } = _req.body;
        const uploadedImage = await uploadImage({
            encodedImage,
            preset: 'profiles',
        });

        if (uploadedImage.ok) {
            const { secure_url } = uploadedImage.uploadedResponse;
            try {
                const updatedProfile = await db.query(
                    `
                    UPDATE users
                    SET profileImage = $1
                    WHERE user_id = $2
                    RETURNING profileImage
                `,
                    [secure_url, userId]
                );

                return _res.status(201).json({
                    ok: true,
                    user: {
                        profileImage: updatedProfile.rows[0].profileImage,
                    },
                });

                //
            } catch (error) {
                return _res.json({
                    ok: false,
                    error: {
                        message: 'Something went wrong, please try again.',
                    },
                });
            }
        }

        return _res.json({
            ok: false,
            error: {
                message: 'Something went wrong, please try again.',
            },
        });
        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.post('/updateBannerImage', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;

        const { encodedImage } = _req.body;
        const uploadedImage = await uploadImage({
            encodedImage,
            preset: 'banners',
        });

        if (uploadedImage.ok) {
            const { secure_url } = uploadedImage.uploadedResponse;
            try {
                const updatedProfile = await db.query(
                    `
                    UPDATE users
                    SET headerImage = $1
                    WHERE user_id = $2
                    RETURNING headerImage
                `,
                    [secure_url, userId]
                );

                return _res.status(201).json({
                    ok: true,
                    user: {
                        headerImage: updatedProfile.rows[0].headerImage,
                    },
                });

                //
            } catch (error) {
                return _res.json({
                    ok: false,
                    error: {
                        message: 'Something went wrong, please try again.',
                    },
                });
            }
        }

        return _res.json({
            ok: false,
            error: {
                message: 'Something went wrong, please try again.',
            },
        });
        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.post('/recommendUsers', async (_req, _res) => {
    try {
        const { usersFollowed, userId } = _req.body;

        // if the user hasn't followed any other users, the query will look something like OR b.creator_id IN () which will result in an error
        let usersFollowedQuery = '';
        if (usersFollowed.length > 0) {
            usersFollowedQuery = `b.creator_id NOT IN (${usersFollowed}) AND`;
        }

        const recommendationQuery = await db.query(
            `
            SELECT DISTINCT
                u.user_id as "userId",
                u.first_name as "firstName",
                u.last_name as "lastName",
                u.interest as "interest",
                u.workplace as "workplace",
                u.profileimage as "profileImage"
            FROM blogs b
            INNER JOIN users u ON u.user_id = b.creator_id
            WHERE ${usersFollowedQuery} b.creator_id!=$1 LIMIT 3;
        `,
            [userId]
        );

        return _res.json({
            ok: true,
            users: recommendationQuery.rows,
        });

        //
    } catch (err) {
        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

export default router;
