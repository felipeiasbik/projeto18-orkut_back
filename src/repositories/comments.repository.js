import { db } from "../database/database.connection.js";

export function tokenExistsDB(token){
    const result = db.query(`SELECT * FROM "blackListToken" WHERE token = $1;`, [token]);
    return result;
}

export function createCommentDB(userId, postId, comment){
    const result = db.query(`
    INSERT INTO "comments" ("userId", "postId", "comment")
    VALUES ($1, $2, $3)
    ;`, [userId.idUser, postId, comment]);
    return result;
}

export function getCommentsId(postId){
    const result = db.query(`
    SELECT
        u.name,
        u.photo,
        c.comment
    FROM comments c
    JOIN users u ON u.id = c."userId"
    WHERE c."postId" = $1
    ORDER BY c."createdAt" DESC
    ;`, [postId]);
    return result;
}