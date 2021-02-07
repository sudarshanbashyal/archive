import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
dotenv.config();

export interface PayloadType extends Request {
    user: String | Object;
}

export const isAuth = (
    _req: PayloadType,
    _res: Response,
    _next: NextFunction
) => {
    try {
        const authorization = _req.headers['authorization'];

        if (!authorization) {
            return _res.status(401).json({
                ok: false,
                error: {
                    message: 'Access Denied.',
                },
            });
        }

        const authToken = authorization.split(' ')[1];
        const payload = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET!);
        _req.user = payload;
        return _next();
        //
    } catch (err) {
        return _res.status(401).json({
            ok: false,
            error: {
                message: 'Access Denied.',
                err,
            },
        });
    }
};

export const createAccessToken = (user: any) => {
    return jwt.sign({ userId: user.user_id }, process.env.ACCESS_TOKEN_SECRET!);
};

export const createRefreshToken = (user: any) => {
    return jwt.sign(
        { userId: user.user_id },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: '10d',
        }
    );
};
