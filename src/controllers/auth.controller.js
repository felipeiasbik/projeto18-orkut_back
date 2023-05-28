import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { logoutDB, tokenExistsDB, userExistsDB, userInsertDB } from "../repositories/auth.repository.js";

export async function signUp(req, res) {
    const { name, email, photo, biography, password, confirmPassword } = req.body;
    try {
        const user = await userExistsDB(email);
        if (user.rowCount !== 0) return res.status(409).send("Usuário já existe!");

        if (password === confirmPassword){
            const passCrypt = bcrypt.hashSync(password, 10);
            await userInsertDB(name, email, photo, biography, passCrypt);
        }

        res.status(201).send("Usuário cadastrado com sucesso!")
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;
    try {
        const user = await userExistsDB(email);
        if (user.rowCount === 0) return res.status(401).send
        ("Verifique se o e-mail está cadastrado e/ou se a senha está correta");

        const checkPass = bcrypt.compareSync(password, user.rows[0].password);
        if (!checkPass) return res.status(401).send
        ("Verifique se o e-mail está cadastrado e/ou se a senha está correta");

        if (user && checkPass){
            const payload = { idUser: user.rows[0].id };
            const token = Jwt.sign(payload, process.env.JWT_SECRET);

            res.send({token, idUser: user.rows[0].id });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function logOut(req, res) {    
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);
    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário já deslogado!");

        await logoutDB(token);
        res.send("Usuário deslogado com sucesso!")
    } catch (err) {
        res.status(500).send(err.message);
    }
}