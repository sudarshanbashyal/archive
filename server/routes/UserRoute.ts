import Express from 'express';
import { db } from '../database/db';
import bcrypt from 'bcrypt';
import { isAuth, createAccessToken, createRefreshToken } from '../utils/auth';
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

        // generate access token
        const accessToken = createAccessToken(user);

        // deliver refresh token in client's cookie
        _res.cookie('jwtToken', createRefreshToken(user), {
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
            accessToken,
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
            const payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);

            return _res.json({
                ok: true,
                payload,
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

export default router;
