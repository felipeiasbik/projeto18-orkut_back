
import Jwt from "jsonwebtoken";
import { createCommentDB, getCommentsId, tokenExistsDB } from "../repositories/comments.repository.js";

export async function createComment(req, res){
    const { postId, comment } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);
        await createCommentDB(userId, postId, comment);

        res.status(201).send("Comentário publicado!")
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getComment(req, res){
    const { postId } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const commentsId = await getCommentsId(postId);

        res.send(commentsId.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}