import { db } from "../database/database.connection.js";

export function tokenExistsDB(token){
    const result = db.query(`SELECT * FROM "blackListToken" WHERE token = $1;`, [token]);
    return result;
}

export function userExistsDB(userFollowId){
    const result = db.query(`SELECT * FROM users WHERE id=$1;`,[userFollowId]);
    return result;
}

export function alreadyFollowDB(userId, userFollowId){
    const result = db.query(`
    SELECT * FROM followers WHERE "userId" = $1 AND "userFollowId" = $2;`, [userId.idUser, userFollowId]);
    return result;
}

export function followUsersDB(userId, userFollowId){
    const result = db.query(`
    INSERT INTO followers ("userId", "userFollowId")
    VALUES ($1, $2)
    ;`, [userId.idUser, userFollowId]);
    return result;
}

export function unfollowUsersDB(userId, userFollowId){
    const result = db.query(`
    DELETE FROM followers WHERE "userId" = $1 AND "userFollowId" = $2
    ;`, [userId.idUser, userFollowId]);
    return result;
}

export function myFollowersDB(userFollowId){
    const result = db.query(`
    SELECT 
      COUNT(*)::INTEGER AS total,
      JSON_AGG(u.name) AS followers
    FROM followers f
    JOIN users u ON f."userId" = u.id
    WHERE f."userFollowId" = $1
    ;`, [userFollowId]);
    return result;
}