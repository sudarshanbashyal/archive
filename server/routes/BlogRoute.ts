import Express from 'express';
import { isAuth, PayloadType } from '../utils/auth';
import { db } from '../database/db';
import { uploadImage } from '../utils/uploadImage';

const router = Express.Router();

router.get('/getTopics', async (_req, _res) => {
    try {
        const topics = await db.query(`select * from topics;`);

        return _res.json({
            ok: true,
            data: topics.rows,
        });
    } catch (error) {
        return _res.json({
            ok: false,
            error,
        });
    }
});

router.post('/postBlog', isAuth, async (_req: PayloadType, _res) => {
    try {
        const { blogTitle, blogContent, topicId, encodedImage } = _req.body;
        const userId = _req.userId;

        const uploadedImage = await uploadImage({
            encodedImage,
            preset: 'headers',
        });
        if (uploadedImage.ok) {
            const { secure_url } = uploadedImage.uploadedResponse;

            try {
                await db.query(
                    `INSERT INTO blogs(title, blog_content, header_image, topic_id, creator_id) 
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                    [blogTitle, blogContent, secure_url, topicId, userId]
                );

                return _res.json({
                    ok: true,
                });
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
    } catch (error) {
        return _res.json({
            ok: false,
            error,
        });
    }
});

router.get('/getFollowingBlogs/:id', async (_req, _res) => {
    try {
        const userId = _req.params.id;

        const topicsQuery = await db.query(
            `SELECT topics_followed FROM users WHERE user_id=$1`,
            [userId]
        );

        if (!topicsQuery.rows[0]) {
            return _res.status(404).json({
                ok: false,
                error: {
                    message: 'No user found.',
                },
            });
        }

        const topicsArray = topicsQuery.rows[0].topics_followed;

        const topics = await db.query(
            `SELECT * FROM topics WHERE topic_id IN (${topicsArray.toString()})`
        );

        return _res.json({
            ok: true,
            topics: topics.rows,
        });
        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get('/followTopic/:id', isAuth, async (_req: PayloadType, _res) => {
    try {
        //
        const userid = _req.userId;
        const topicId = _req.params.id;

        const followQuery = await db.query(
            `
            UPDATE users
            SET topics_followed = array_append(topics_followed, $1)
            WHERE user_id = $2
            RETURNING topics_followed;
            `,
            [topicId, userid]
        );

        if (!followQuery) {
            return _res.status(500).json({
                ok: false,
                error: {
                    message: 'Something went wrong.',
                },
            });
        }

        return _res.status(201).json({
            ok: true,
            topics: followQuery.rows[0].topics_followed,
        });

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get('/unfollowTopic/:id', isAuth, async (_req: PayloadType, _res) => {
    try {
        //
        const userid = _req.userId;
        const topicId = _req.params.id;

        const followQuery = await db.query(
            `
            UPDATE users
            SET topics_followed = array_remove(topics_followed, $1)
            WHERE user_id = $2
            RETURNING topics_followed;
            `,
            [topicId, userid]
        );

        if (!followQuery) {
            return _res.status(500).json({
                ok: false,
                error: {
                    message: 'Something went wrong.',
                },
            });
        }

        return _res.status(201).json({
            ok: true,
            topics: followQuery.rows[0].topics_followed,
        });

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get('/likeBlog/:id', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;
        const blogId = +_req.params.id;

        try {
            const likeQuery = await db.query(
                `
                UPDATE blogs
                SET likes = array_append(likes, $1)
                WHERE blog_id=$2
                RETURNING likes
                `,
                [userId, blogId]
            );

            return _res.status(201).json({
                ok: true,
                blog: likeQuery.rows[0].likes,
            });

            //
        } catch (error) {
            return _res.status(500).json({
                ok: false,
                error,
            });
        }

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get('/dislikeBlog/:id', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;
        const blogId = _req.params.id;

        try {
            const dislikeQuery = await db.query(
                `
                UPDATE blogs
                SET likes = array_remove(likes, $1)
                WHERE blog_id=$2
                RETURNING likes
                `,
                [userId, blogId]
            );

            return _res.status(201).json({
                ok: true,
                blog: dislikeQuery.rows[0].likes,
            });

            //
        } catch (error) {
            return _res.status(500).json({
                ok: false,
                error,
            });
        }

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

export default router;
