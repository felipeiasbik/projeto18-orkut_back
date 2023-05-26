import { Router } from "express";
import { searchUser } from "../controllers/search.controller.js";

const searchRouter = Router();

searchRouter.get("/search", searchUser);

export default searchRouter;
