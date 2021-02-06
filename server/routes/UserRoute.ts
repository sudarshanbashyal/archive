import Express from 'express';
import { db } from '../database/db';
import bcrypt from 'bcrypt';
import { isAuth, createAccessToken, createRefreshToken } from '../utils/auth';

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

        // generate tokens
        const accessToken = createAccessToken(user);

        return _res.json({
            ok: true,
            user: user.rows[0],
            accessToken,
        });
    } catch (err) {
        return _res.json({
            ok: false,
            error: {
                message: 'Something went wrong.',
                err,
            },
        });
    }
});

router.delete('/deleteAccount', async (_req, _res) => {});

export default router;
