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

router.get(
    '/toggleLikes/:id/:status',
    isAuth,
    async (_req: PayloadType, _res) => {
        try {
            const userId = _req.userId;
            const blogId = _req.params.id;
            const status = _req.params.status;

            try {
                const dislikeQuery = await db.query(
                    `
                UPDATE blogs
                SET likes = ${status}(likes, $1)
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
    }
);

router.get('/getBlog/:id', async (_req, _res) => {
    try {
        const blogId = _req.params.id;

        const blogQuery = await db.query(
            `SELECT 
                b.title, 
                b.blog_content, 
                b.header_image, 
                b.created_at,
                b.likes,
                u.user_id,
                u.first_name,
                u.last_name,
                u.profileimage,
                u.interest
            FROM blogs b
            INNER JOIN users u ON u.user_id=b.creator_id
            WHERE b.blog_id=$1;`,
            [blogId]
        );

        if (!blogQuery.rows[0]) {
            return _res.status(404).json({
                ok: false,
                error: {
                    message: 'No blog found.',
                },
            });
        }

        return _res.json({
            ok: true,
            blog: blogQuery.rows[0],
        });

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get('/getComments/:id', async (_req, _res) => {
    try {
        const blogId = +_req.params.id;
        const commentQuery = await db.query(
            `
            SELECT 
                u.user_id, 
                u.profileimage, 
                u.first_name, 
                u.last_name, 
                c.comment_id, 
                c.comment_content, 
                c.liked_by,
                c.created_at
            FROM users u
            INNER JOIN comments c ON c.user_id = u.user_id
            INNER JOIN blogs b ON b.blog_id = c.blog_id
            WHERE b.blog_id = $1;
        `,
            [blogId]
        );

        return _res.json({
            ok: true,
            comments: commentQuery.rows,
        });
        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.post('/postComment/:id', isAuth, async (_req: PayloadType, _res) => {
    try {
        const blogId = +_req.params.id;
        const userId = _req.userId;
        const commentContent = _req.body.commentContent;

        if (!commentContent) {
            return _res.status(400).json({
                ok: false,
                error: {
                    message: 'No comment found.',
                },
            });
        }

        const commentQuery = await db.query(
            `INSERT INTO comments(user_id, blog_id, comment_content)
            VALUES($1, $2, $3)
            RETURNING comment_id;`,
            [userId, blogId, commentContent]
        );

        const postedCommentQuery = await db.query(
            `
            SELECT 
                u.user_id, 
                u.profileimage, 
                u.first_name, 
                u.last_name, 
                c.comment_id, 
                c.comment_content, 
                c.liked_by,
                c.created_at
            FROM users u
            INNER JOIN comments c ON c.user_id = u.user_id
            INNER JOIN blogs b ON b.blog_id = c.blog_id
            WHERE c.comment_id = $1;
        `,
            [commentQuery.rows[0].comment_id]
        );

        return _res.status(201).json({
            ok: true,
            comment: postedCommentQuery.rows[0],
        });

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get('/getBookmarks', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;
        let bookmarkQuery = await db.query(
            `
            SELECT bookmarks FROM users WHERE user_id=$1; 
            `,
            [userId]
        );

        if (!bookmarkQuery.rows[0].bookmarks) {
            return _res.json({
                ok: true,
                bookmarks: [],
            });
        }

        bookmarkQuery = await db.query(
            `
            SELECT
                u.first_name,
                u.user_id,
                u.profileimage,
                b.blog_id,
                b.title,
                t.topic_title
            FROM users u
            INNER JOIN blogs b ON b.creator_id=u.user_id
            INNER JOIN topics t ON t.topic_id=b.topic_id
            WHERE b.blog_id IN (${bookmarkQuery.rows[0].bookmarks.toString()});
            `
        );

        return _res.json({
            ok: true,
            bookmarks: bookmarkQuery.rows,
        });
        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get(
    '/toggleBookmark/:id/:status',
    isAuth,
    async (_req: PayloadType, _res) => {
        try {
            const blogId = _req.params.id;
            const userId = _req.userId;
            const status = _req.params.status;

            console.log(status);
            console.log(userId);
            const bookmarkQuery = await db.query(
                `
                UPDATE users
                SET bookmarks = ${status}(bookmarks, $1)
                WHERE user_id=$2
                RETURNING bookmarks;
                `,
                [blogId, userId]
            );

            return _res.status(201).json({
                ok: true,
                bookmarks: bookmarkQuery.rows[0].bookmarks,
            });
            //
        } catch (error) {
            return _res.status(500).json({
                ok: false,
                error,
            });
        }
    }
);

export default router;
