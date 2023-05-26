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
    const result = db.query(`SELECT * FROM post WHERE "userId" = $1;`, [userId.idUser]);
    return result;
}

export function myPostsIdDB(id, userId){
    const result = db.query(`SELECT * FROM post WHERE id = $1 AND "userId" = $2;`, [id, userId.idUser]);
    return result;
}

export function listPostsDB(){
    // const result = db.query(`SELECT * FROM post ORDER BY "createdAt" DESC;`);
    const result = db.query(`
    SELECT
        p.id,
        p.photo,
        p.description,
        p."createdAt",
        u.name AS "nameUser",
        u.photo AS "photoProfile",
        (
            SELECT JSON_AGG(u2.name)
            FROM likes l
            JOIN users u2 ON u2.id = l."userId"
            WHERE l."postId" = p.id
        ) AS "likes",
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'commentId', c.id,
                'userId', c."userId",
                'comment', c."comment",
                'userPhoto', (SELECT photo FROM users WHERE id = c."userId")
            )
        ) AS "comments"
    FROM post p
    JOIN users u ON u.id = p."userId"
    LEFT JOIN "comments" c ON c."postId" = p.id
    GROUP BY p.id, u.id
    ORDER BY p."createdAt" DESC;
    `);
    return result;
}