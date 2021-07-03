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
                u.user_id as "userId", 
                u.profileimage as "profileImage", 
                u.first_name as "firstName", 
                u.last_name as "lastName", 
                c.comment_id as "commentId", 
                c.comment_content as "commentContent", 
                c.liked_by as "likedBy",
                c.created_at as "createdAt"
            FROM users u
            INNER JOIN comments c ON c.user_id = u.user_id
            INNER JOIN blogs b ON b.blog_id = c.blog_id
            WHERE b.blog_id = $1 AND c.parent_id IS NULL ORDER BY c.created_at DESC;
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
        const parentId = _req.body.parentId;

        if (!commentContent) {
            return _res.status(400).json({
                ok: false,
                error: {
                    message: 'No comment found.',
                },
            });
        }

        let commentQuery;

        if (!parentId) {
            commentQuery = await db.query(
                `
                    INSERT INTO comments(user_id, blog_id, comment_content)
                    VALUES($1, $2, $3)
                    RETURNING comment_id;
                    `,
                [userId, blogId, commentContent]
            );
        } else {
            commentQuery = await db.query(
                `
                    INSERT INTO comments(user_id, blog_id, comment_content, parent_id)
                    VALUES($1, $2, $3, $4)
                    RETURNING comment_id;
                    `,
                [userId, blogId, commentContent, parentId]
            );
        }

        const postedCommentQuery = await db.query(
            `
            SELECT 
                u.user_id as "userId", 
                u.profileimage as "profileImage", 
                u.first_name as "firstName", 
                u.last_name as "lastName", 
                c.comment_id as "commentId", 
                c.comment_content as "commentContent", 
                c.liked_by as "likedBy",
                c.created_at as "createdAt"
            FROM users u
            INNER JOIN comments c ON c.user_id = u.user_id
            INNER JOIN blogs b ON b.blog_id = c.blog_id
            WHERE c.comment_id = $1
            ORDER BY c.created_at;
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

router.get('/getChildrenComment/:parentId', async (_req, _res) => {
    try {
        const parentId = _req.params.parentId;
        const commentQuery = await db.query(
            `
            SELECT 
                u.user_id as "userId", 
                u.profileimage as "profileImage", 
                u.first_name as "firstName", 
                u.last_name as "lastName", 
                c.comment_id as "commentId", 
                c.comment_content as "commentContent", 
                c.liked_by as "likedBy",
                c.created_at as "createdAt"
            FROM users u
            INNER JOIN comments c ON c.user_id = u.user_id
            INNER JOIN blogs b ON b.blog_id = c.blog_id
            WHERE c.parent_id=$1;
        `,
            [parentId]
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

router.post(
    '/toggleComment/:id/:status',
    isAuth,
    async (_req: PayloadType, _res) => {
        try {
            const userId = _req.userId;
            const commentId = _req.params.id;
            const commentStatus = _req.params.status;
            console.log(userId, commentId, commentStatus);

            const toggleQuery = await db.query(
                `
                UPDATE comments
                SET liked_by = ${commentStatus}(liked_by, $1)
                WHERE comment_id=$2
                RETURNING liked_by;
                `,
                [userId, commentId]
            );

            return _res.status(201).json({
                ok: true,
                likedBy: toggleQuery.rows[0].liked_by,
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

router.get('/countChildren/:id', async (_req, _res) => {
    try {
        const commentId = _req.params.id;
        const childrenQuery = await db.query(
            `
            SELECT COUNT(*) FROM comments WHERE parent_id=$1;
        `,
            [commentId]
        );

        return _res.json({
            ok: true,
            children: childrenQuery.rows[0].count,
        });

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get('/generateFeed', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;

        const userPreferencesQuery = await db.query(
            `SELECT users_followed, topics_followed FROM users WHERE user_id=$1`,
            [userId]
        );

        // get topics and users followed by a user
        const usersFollowedArray =
            userPreferencesQuery.rows[0].users_followed.toString();
        const topicsFollowedArray =
            userPreferencesQuery.rows[0].topics_followed.toString();

        // if the user hasn't followed any other users, the query will look something like OR b.creator_id IN () which will result in an error
        let usersFollowedQuery = `WHERE (t.topic_id IN (${topicsFollowedArray}) OR b.creator_id IN (${usersFollowedArray}))`;
        if (usersFollowedArray.length === 0) {
            usersFollowedQuery = `WHERE t.topic_id IN (${topicsFollowedArray})`;
        }

        // generate feed according to those follows
        const feedGenerationQuery = await db.query(`     
            SELECT 
                b.blog_id as "blogId",
                b.title as "blogTitle",
                u.user_id as "authorId",
                u.first_name as "authorName",
                u.profileimage as "authorProfileImage",
                t.topic_title as "blogTopic"
            FROM blogs b
            INNER JOIN users u ON u.user_id = b.creator_id
            INNER JOIN topics t on t.topic_id = b.topic_id
            ${usersFollowedQuery}
            ORDER BY b.created_at DESC;
        `);

        return _res.json({
            ok: true,
            feed: feedGenerationQuery.rows,
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
    '/generateExplore/:category/:topic/:timeline',
    async (_req, _res) => {
        try {
            const category = _req.params.category;
            const selectedTopic = _req.params.topic;
            const timeline = _req.params.timeline;

            let optionalTopicQuery =
                selectedTopic !== 'undefined'
                    ? `WHERE t.topic_id=${selectedTopic}`
                    : '';

            if (timeline !== 'all') {
                if (optionalTopicQuery !== '') {
                    optionalTopicQuery += ` AND b.created_at > now() - interval '1 ${timeline}'`;
                } else {
                    optionalTopicQuery = `WHERE b.created_at > now() - interval '1 ${timeline}'`;
                }
            }

            const exploreQuery = await db.query(`
            SELECT 
                b.blog_id as "blogId",
                b.title as "blogTitle",
                u.user_id as "authorId",
                u.first_name as "authorName",
                u.profileimage as "authorProfileImage",
                t.topic_title as "blogTopic"
            FROM blogs b
            INNER JOIN users u ON u.user_id = b.creator_id
            INNER JOIN topics t on t.topic_id = b.topic_id
            ${optionalTopicQuery}
            ORDER BY ${category} DESC;`);

            return _res.json({
                ok: true,
                blogs: exploreQuery.rows,
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

router.post('/saveDraft', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;
        const draftTitle = _req.body.draftTitle;
        const draftContent = _req.body.draftContent || '';

        const savedDraft = await db.query(
            `
            INSERT INTO drafts(draft_title, draft_content, creator_id)
            VALUES($1, $2, $3)
            RETURNING *;
            `,

            [draftTitle, draftContent, userId]
        );

        if (savedDraft.rows[0]) {
            return _res.status(201).json({
                ok: true,
                error: {
                    message: 'Something went wrong. Please try again.',
                },
            });
        }

        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong. Please try again.',
            },
        });

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.post('/updateDraft/:id', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;
        const draftId = _req.params.id;
        const draftTitle = _req.body.draftTitle;
        const draftContent = _req.body.draftContent || '';

        const savedDraft = await db.query(
            `
            UPDATE drafts SET draft_title = $1, draft_content=$2, last_modified = now()
            WHERE draft_id=$3 AND creator_id=$4 RETURNING *;
            `,

            [draftTitle, draftContent, draftId, userId]
        );

        if (savedDraft.rows[0]) {
            return _res.status(201).json({
                ok: true,
                error: {
                    message: 'Something went wrong. Please try again.',
                },
            });
        }

        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong. Please try again.',
            },
        });

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get('/getDrafts', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;
        const draftQuery = await db.query(
            `
            SELECT 
                draft_id as "draftId",
                draft_title as "draftTitle",
                draft_content as "draftContent",
                last_modified as "lastModified"
            FROM drafts
            WHERE creator_id=$1;
        `,
            [userId]
        );

        return _res.json({
            ok: true,
            drafts: draftQuery.rows,
        });

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get('/getDraft/:id', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;
        const draftId = _req.params.id;

        const draftQuery = await db.query(
            `
            SELECT * FROM drafts WHERE draft_id=$1 AND creator_id=$2
        `,
            [draftId, userId]
        );

        if (draftQuery.rows[0]) {
            return _res.json({
                ok: true,
                draft: draftQuery.rows[0],
            });
        }

        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong. Please try again.',
            },
        });

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

router.get('/deleteComment/:id', isAuth, async (_req: PayloadType, _res) => {
    try {
        const userId = _req.userId;
        const commentId = _req.params.id;

        await db.query(
            `
            DELETE FROM comments WHERE parent_id=$1;
        `,
            [commentId]
        );

        const deleteQuery = await db.query(
            `
            DELETE FROM comments WHERE comment_id=$1 AND user_id=$2;
        `,
            [commentId, userId]
        );

        if (deleteQuery) {
            return _res.status(201).json({
                ok: true,
            });
        }

        return _res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong. Please try again.',
            },
        });

        //
    } catch (error) {
        return _res.status(500).json({
            ok: false,
            error,
        });
    }
});

export default router;
