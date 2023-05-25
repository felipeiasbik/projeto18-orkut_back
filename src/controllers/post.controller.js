import { listPostsDB, myPostsDB, postImageDB, tokenExistsDB } from "../repositories/post.repository.js";
import Jwt from "jsonwebtoken";

export async function postImage(req, res){
    const { photo, description } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);
        await postImageDB(userId, photo, description)

        res.status(201).send("Post publicado!");

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function myPostId(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);
        const postsUser = await myPostsDB(userId);

        res.send(postsUser.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function timeLine(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);

        let listPosts; 
        if (userId) {
            listPosts = await listPostsDB();
        }

        res.send(listPosts.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}