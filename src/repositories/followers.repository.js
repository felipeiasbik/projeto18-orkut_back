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
        users.name,
        users.id,
        users.photo,
        users.biography,
        (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', users.id,
                    'name', users.name,
                    'photo', users.photo
                )
            )
            FROM users
            JOIN followers ON followers."userId" = users.id
            WHERE followers."userFollowId" = $1
        ) AS "myFollowers"
    FROM users
    WHERE users.id = $1;
   
    `, [userFollowId]);
    return result;
}

export function followingDB(id){
    const result = db.query(`

    SELECT
        users.name,
        users.id,
        users.photo,
        users.biography,
        (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', users.id,
                    'name', users.name,
                    'photo', users.photo
                )
            )
            FROM users
            JOIN followers ON followers."userFollowId" = users.id
            WHERE followers."userId" = $1
        ) AS "following"
    FROM users
    WHERE users.id = $1;

    
    ;`,[id]);
    return result;
}