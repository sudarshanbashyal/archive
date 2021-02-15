import Express from 'express';
import { db } from '../database/db';
import bcrypt from 'bcrypt';
import {
    isAuth,
    createAccessToken,
    createRefreshToken,
    PayloadType,
} from '../utils/auth';
import jwt, { verify } from 'jsonwebtoken';

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
            user_followed,
            topics_followed,
            profileimage,
            headerimage,
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
                usersFollowed: user_followed,
                topicsFollowed: topics_followed,
                profileImage: profileimage,
                headerImage: headerimage,
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
                user_followed,
                topics_followed,
                profileimage,
                headerimage,
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
                    usersFollowed: user_followed,
                    topicsFollowed: topics_followed,
                    profileImage: profileimage,
                    headerImage: headerimage,
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
                b.blog_id,
                b.title,
                b.header_image,
                b.created_at,
                t.topic_title
            FROM users u
            INNER JOIN blogs b ON u.user_id=b.creator_id
            INNER JOIN topics t ON b.topic_id = t.topic_id
            WHERE u.user_id=$1;`,
            [profileId]
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
