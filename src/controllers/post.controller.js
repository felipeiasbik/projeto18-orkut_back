import { listPostsDB, myPostsDB, myPostsIdDB, postImageDB, tokenExistsDB } from "../repositories/post.repository.js";
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

export async function myPost(req, res){
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

export async function myPostId(req, res){
    const { id } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);

        const postsUser = await myPostsIdDB(id, userId);
        if (postsUser.rowCount === 0)
        return res.status(400).send("Postagem não pertence ao usuário ou não existe.")

        res.send(postsUser.rows[0]);
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