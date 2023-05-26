import { searchNameDB, tokenExistsDB } from "../repositories/search.repository.js";

export async function searchUser(req, res){
    const { name } = req.query;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const tokenActive = await tokenExistsDB(token);
        if (tokenActive.rowCount !== 0) return res.status(401).send("Usuário sem acesso permitido!");

        const search = await searchNameDB(name);

        res.send(search.rows)
    } catch (err) {
        res.status(500).send(err.message);
    }
}