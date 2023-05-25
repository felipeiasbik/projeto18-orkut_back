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
    const result = db.query(`SELECT * FROM post ORDER BY "createdAt" DESC;`);
    return result;
}