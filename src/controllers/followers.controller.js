import { alreadyFollowDB, followUsersDB, myFollowersDB, tokenExistsDB, unfollowUsersDB, userExistsDB } from "../repositories/followers.repository.js";
import Jwt from "jsonwebtoken";

export async function followUsers(req, res){
    const { userFollowId } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try{
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);
        
        if (userFollowId === userId.idUser) return res.status(401).send("Não é permitido seguir você próprio(a)!");

        const checkUser = await userExistsDB(userFollowId);
        if (checkUser.rowCount === 0) return res.status(401).send("O usuário que você quer seguir não existe.");

        const alreadyFollow = await alreadyFollowDB(userId, userFollowId);
        if (alreadyFollow.rowCount !== 0) return res.status(401).send("Você já segue o usuário.");

        await followUsersDB(userId, userFollowId);

        return res.send("Seguindo")
    } catch(err) {
        res.status(500).send(err.message);
    }
}

export async function deleteFollowUsers(req, res){
    const { userFollowId } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);
    
     try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);

        if (userFollowId === userId.idUser) return res.status(401).send("Você não segue você próprio(a)!");

        const checkUser = await userExistsDB(userFollowId);
        if (checkUser.rowCount === 0) return res.status(401).send("O usuário que você quer deixar de seguir não existe.");

        const alreadyFollow = await alreadyFollowDB(userId, userFollowId);
        if (alreadyFollow.rowCount === 0) return res.status(401).send("Você não segue o usuário.");

        await unfollowUsersDB(userId, userFollowId);

        res.send("Deixando de seguir")

     } catch (err) {
        res.status(500).send(err.message);
     }
}

export async function myFollowersId(req, res){
    const { userFollowId } = req.body;

    try {
        const myFollowers = await myFollowersDB(userFollowId);
        
        res.send(myFollowers.rows[0]);

    } catch (err) {
        res.status(500).send(err.message);
    }
}