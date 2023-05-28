import { alreadyFollowDB, followUsersDB, followingDB, myFollowersDB, tokenExistsDB, unfollowUsersDB, userExistsDB } from "../repositories/followers.repository.js";
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
    const { id } = req.params;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);
    
     try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const userId = Jwt.verify(token, process.env.JWT_SECRET);

        if (id === userId.idUser) return res.status(401).send("Você não segue você próprio(a)!");

        const checkUser = await userExistsDB(id);
        if (checkUser.rowCount === 0) return res.status(401).send("O usuário que você quer deixar de seguir não existe.");

        const alreadyFollow = await alreadyFollowDB(userId, id);
        if (alreadyFollow.rowCount === 0) return res.status(401).send("Você não segue o usuário.");

        await unfollowUsersDB(userId, id);

        res.send("Deixando de seguir")

     } catch (err) {
        res.status(500).send(err.message);
     }
}

export async function myFollowersId(req, res){
    const { id } = req.params;

    try {
        const myFollowers = await myFollowersDB(id);
        
        res.send(myFollowers.rows[0]);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function followingsId(req, res){
    const { id } = req.params;

    try {
        const following = await followingDB(id);
        
        res.send(following.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}