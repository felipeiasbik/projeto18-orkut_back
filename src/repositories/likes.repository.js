import { db } from "../database/database.connection.js";

export function tokenExistsDB(token){
    const result = db.query(`SELECT * FROM "blackListToken" WHERE token = $1;`, [token]);
    return result;
}

export function likePostDB(userId, postId){
    const result = db.query(`
    INSERT INTO likes ("userId", "postId")
    VALUES ($1, $2)
    ;`, [userId.idUser, postId]);
    return result;
}

export function postExistsDB(postId){
    const result = db.query(`
    SELECT * FROM post WHERE id = $1;`, [postId]);
    return result;
}

export function checkLikeDB(userId, postId){
    const result = db.query(`
    SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2;`, [userId.idUser, postId]);
    return result;
}

export function dislikePostDB(userId, postId){
    const result = db.query(`DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2;`,
    [userId.idUser, postId]);
    return result;
}

export function checkLikesUserDB(userId){
    const result = db.query(`
    SELECT
        ARRAY_AGG(DISTINCT likes."postId") AS "postsIds"
        FROM likes
        WHERE "userId" = $1
    ;`, [userId.idUser]);
    return result;
}