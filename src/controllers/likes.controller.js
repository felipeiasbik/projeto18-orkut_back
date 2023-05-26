import { checkLikeDB, checkLikesUserDB, dislikePostDB, likePostDB, postExistsDB, tokenExistsDB } from "../repositories/likes.repository.js";
import Jwt from "jsonwebtoken";

export async function likesPosts(req, res){
    const { postId } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);

        const postExists = await postExistsDB(postId);
        if (postExists.rowCount === 0) return res.status(401).send("Post não existe");

        const checkLike = await checkLikeDB(userId, postId);
        if (checkLike.rowCount !== 0) return res.status(401).send("Já deu like neste post.");

        await likePostDB(userId, postId);

        res.send("Like")
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteLikesPosts(req, res){
    const { postId } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);

        const postExists = await postExistsDB(postId);
        if (postExists.rowCount === 0) return res.status(401).send("Post não existe");

        const checkLike = await checkLikeDB(userId, postId);
        if (checkLike.rowCount === 0) return res.status(401).send("Você não deu like neste post.");

        await dislikePostDB(userId, postId);

        res.send("Dislike")
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function myLikessId(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);
        const checkMyLikes = await checkLikesUserDB(userId);

        if (checkMyLikes.rows[0].postsIds === null) return res.status(404).send("Usuário não deu nenhum like.")

        res.send(checkMyLikes.rows[0].postsIds)
    } catch (err) {
        res.status(500).send(err.message);
    }
}