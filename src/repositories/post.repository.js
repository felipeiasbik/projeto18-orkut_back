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
                    ) ORDER BY l."createdAt" ASC
            ) AS likes
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
    `, [id]);
    return result;

    // const result = db.query(`
    // SELECT * 
    // FROM post 
    // WHERE id = $1 AND "userId" = $2
    // ORDER BY "createdAt" DESC;
    // `, [id, userId.idUser]);
    // return result;
}

export function myPostsIdUserDB(id){
    const result = db.query(`SELECT id, name, photo, biography FROM users WHERE id = $1;`, [id]);
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
        u.id AS "idUser",
        u.name AS "nameUser",
        u.photo AS "photoProfile",
        (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', u2.id, 
                    'name', u2.name
                    ) ORDER BY l."createdAt" ASC
                )
            FROM likes l
            JOIN users u2 ON u2.id = l."userId"
            WHERE l."postId" = p.id
        ) AS "likes",
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'commentId', c.id,
                'userId', c."userId",
                'comment', c."comment",
                'userName', (SELECT name FROM users WHERE id = c."userId"),
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


// [
//     {
//       "nameUser": "Felipe Iasbik",
//       "photoProfile": "https://drive.google.com/file/d/1YwEazsuPYGkwfHm4DU13UEe8TPzwKuge/view?usp=share_link",
//       "biography": "Graduado em Administração de Empresas pela UNIPAC e atualmente curso o Bootcamp da Driven Education em Software Engineer. Sou casado, pai de menina e desenvolvedor Full Stack!",
      
//       "posts": [
//             {
//                 "id": 5,
//                 "photo": "https://www.felizcomavida.com/wp-content/uploads/2020/10/como-ser-feliz-trabalhando-em-casa-1-1024x683.jpg",
//                 "description": "Vão dizer que foi sorte!",
//                 "createdAt": "2023-05-24T23:43:54.626Z",
//                 "likes": null,
//                 "comments": [
//                 {
//                     "commentId": null,
//                     "userId": null,
//                     "comment": null,
//                     "userPhoto": null
//                 }
//                 ]
//             },
//             {
//                 "id": 3,
//                 "photo": "https://www.sesc-sc.com.br/sescsc/cache/imagens/institucional_imagem_pq_Institucional_id_8277.jpg",
//                 "description": "De hoje tá pago!",
//                 "createdAt": "2023-05-24T23:41:24.102Z",
//                 "likes": [
//                 "Felipe Iasbik"
//                 ],
//                 "comments": [
//                 {
//                     "commentId": null,
//                     "userId": null,
//                     "comment": null,
//                     "userPhoto": null
//                 }
//                 ]
//             },
//             {
//                 "id": 2,
//                 "photo": "https://pat.feldman.com.br/wp-content/uploads/2012/01/comida-caseira.jpg",
//                 "description": "Almoço de hoje!!!",
//                 "createdAt": "2023-05-24T23:40:30.077Z",
//                 "likes": [
//                 "Felipe Iasbik",
//                 "Jorge Vitor"
//                 ],
//                 "comments": [
//                 {
//                     "commentId": 1,
//                     "userId": 2,
//                     "comment": "Legal demais!",
//                     "userPhoto": "https://media.istockphoto.com/id/125141451/pt/foto/caixa-de-%C3%B3culos-estudante-dando-uma-flor.jpg?s=612x612&w=0&k=20&c=OOkqhbdvSnOaouFkqbRDdx-IAspwU9AZc-nVUH3_EPQ="
//                 },
//                 {
//                     "commentId": 2,
//                     "userId": 3,
//                     "comment": "Legal demais!",
//                     "userPhoto": "https://i.pinimg.com/236x/65/54/47/6554470eeced7b9ff0098a5315852a75.jpg"
//                 }
//                 ]
//             }
//         ]
    
//     }
// ]