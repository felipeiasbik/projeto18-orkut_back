import { Router } from "express";
import { deleteFollowUsers, followUsers, myFollowersId } from "../controllers/followers.controller.js";

const followersRouter = Router();

followersRouter.post("/follow/:id", followUsers);
followersRouter.delete("/follow/:id", deleteFollowUsers);
followersRouter.get("/follow/:id", myFollowersId);

export default followersRouter;