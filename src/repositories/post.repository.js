import { db } from "../database/database.connection.js";

export function tokenExistsDB(token){
    const result = db.query(`SELECT * FROM "blackListToken" WHERE token = $1;`, [token]);
    return result;
}

export function postImageDB(userId, photo, description){
    const result = db.query(`
    INSERT INTO post ("userId", photo, description)
    VALUES ($1, $2, $3)
    ;`,[userId.idUser, photo, description]);
    return result;
}

export function myPostsDB(userId){
    const result = db.query(`
    WITH user_posts AS (
        SELECT
            u.id,
            u.name,
            u.photo,
            u.biography,
            p.id AS post_id,
            p.photo AS post_photo,
            p.description AS post_description,
            p."createdAt" AS post_createdAt
        FROM users u
        JOIN post p ON u.id = p."userId"
        WHERE p."userId" = $1
    ),
    post_likes AS (
        SELECT
            p.post_id,
            jsonb_agg(u.name) AS likes
        FROM user_posts p
        LEFT JOIN likes l ON p.post_id = l."postId"
        JOIN users u ON l."userId" = u.id
        GROUP BY p.post_id
    ),
    post_comments AS (
        SELECT
            p.post_id,
            jsonb_agg(
                jsonb_build_object(
                    'commentId', c.id,
                    'userId', c."userId",
                    'comment', c."comment",
                    'userName', u.name,
                    'userPhoto', u.photo
                )
            ) AS comments
        FROM user_posts p
        LEFT JOIN "comments" c ON p.post_id = c."postId"
        JOIN users u ON c."userId" = u.id
        GROUP BY p.post_id
    )
    SELECT
        up.name,
        up.photo,
        up.biography,
        jsonb_agg(
            jsonb_build_object(
                'id', up.post_id,
                'photo', up.post_photo,
                'description', up.post_description,
                'createdAt', up.post_createdAt,
                'likes', pl.likes,
                'comments', pc.comments
            )
        ) AS posts
    FROM user_posts up
    LEFT JOIN post_likes pl ON up.post_id = pl.post_id
    LEFT JOIN post_comments pc ON up.post_id = pc.post_id
    GROUP BY up.name, up.photo, up.biography;
    `, [userId.idUser]);
    return result;
}

export function lastModifiedAtDB(id){
    const result = db.query(`
    UPDATE likes SET lastmodifiedat = NOW() WHERE "userId" = $1;
    `, [id]);
    return result;
}

export function myPostsIdDB(id){

    const result = db.query(`
    WITH user_posts AS (
        SELECT
            u.id,
            u.name,
            u.photo,
            u.biography,
            p.id AS post_id,
            p.photo AS post_photo,
            p.description AS post_description,
            p."createdAt" AS post_createdAt
        FROM users u
        JOIN post p ON u.id = p."userId"
        WHERE p."userId" = $1
    ),
    post_likes AS (
        SELECT
            p.post_id,
            jsonb_agg(
                JSON_BUILD_OBJECT(
                    'id', u.id, 
                    'name', u.name
                    ) 
                    ORDER BY l."lastmodifiedat" ASC
            ) AS likes
        FROM user_posts p
        LEFT JOIN likes l ON p.post_id = l."postId"
        JOIN users u ON l."userId" = u.id
        WHERE l."like" = $2
        GROUP BY p.post_id
    ),
    post_comments AS (
        SELECT
            p.post_id,
            jsonb_agg(
                jsonb_build_object(
                    'commentId', c.id,
                    'userId', c."userId",
                    'comment', c."comment",
                    'userName', u.name,
                    'userPhoto', u.photo
                )ORDER BY c."createdAt" DESC
            ) AS comments
        FROM user_posts p
        LEFT JOIN "comments" c ON p.post_id = c."postId"
        JOIN users u ON c."userId" = u.id
        GROUP BY p.post_id
    )
    SELECT
        up.id,
        up.name,
        up.photo,
        up.biography,
        jsonb_agg(
            jsonb_build_object(
                'id', up.post_id,
                'photo', up.post_photo,
                'description', up.post_description,
                'createdAt', up.post_createdAt,
                'likes', pl.likes,
                'comments', pc.comments
            )ORDER BY up.post_createdAt DESC
        ) AS posts
    FROM user_posts up
    LEFT JOIN post_likes pl ON up.post_id = pl.post_id
    LEFT JOIN post_comments pc ON up.post_id = pc.post_id
    GROUP BY up.id, up.name, up.photo, up.biography
    ORDER BY MAX(up.post_createdAt) DESC;
    `, [id, true]);
    return result;
}

export function myPostsIdUserDB(id){
    const result = db.query(`SELECT id, name, photo, biography FROM users WHERE id = $1;`, [id]);
    return result;
}

export function listPostsDB(){
    const result = db.query(`
    SELECT
        p.id,
        p.photo,
        p.description,
        p."createdAt",
        u.id AS "idUser",
        u.name AS "nameUser",
        u.photo AS "photoProfile",
        (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', u2.id, 
                    'name', u2.name
                    ) ORDER BY l."lastmodifiedat" ASC
                )
            FROM likes l
            JOIN users u2 ON u2.id = l."userId"
            WHERE l."postId" = p.id AND l."like" = $1
        ) AS "likes",
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'commentId', c.id,
                'userId', c."userId",
                'comment', c."comment",
                'userName', (SELECT name FROM users WHERE id = c."userId"),
                'userPhoto', (SELECT photo FROM users WHERE id = c."userId")
            ) ORDER BY c."createdAt" DESC
        ) AS "comments"
    FROM post p
    JOIN users u ON u.id = p."userId"
    LEFT JOIN "comments" c ON c."postId" = p.id
    GROUP BY p.id, u.id
    ORDER BY p."createdAt" DESC;
    `, [true]);
    return result;
}
