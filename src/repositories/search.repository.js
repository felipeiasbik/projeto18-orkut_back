import { db } from "../database/database.connection.js";

export function tokenExistsDB(token){
    const result = db.query(`SELECT * FROM "blackListToken" WHERE token = $1;`, [token]);
    return result;
}

export function searchNameDB(name){
    const result = db.query(`
    SELECT u.id, u.name, u.photo 
    FROM users u 
    WHERE unaccent(name) ILIKE unaccent('%' || $1 || '%');
    `, [name]);
    return result;
}