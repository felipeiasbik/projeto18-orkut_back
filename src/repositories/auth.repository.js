import { db } from "../database/database.connection.js";

export function userExistsDB(email){
    const result = db.query(`SELECT * FROM users WHERE email=$1;`,[email]);
    return result;
}

export function userInsertDB(name, email, photo, biography, passCrypt){
    const result = db.query(`
    INSERT INTO users (name, email, photo, biography, password)
    VALUES ($1, $2, $3, $4, $5);`
    ,[name, email, photo, biography, passCrypt]
    );
    return result;
}

export function tokenExistsDB(token){
    const result = db.query(`SELECT * FROM "blackListToken" WHERE token = $1;`, [token]);
    return result;
}

export function logoutDB(token){
    const result = db.query(`
    INSERT INTO "blackListToken" (token)
    VALUES ($1);`,
    [token]);
    return result;
}