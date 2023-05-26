import { Router } from "express";
import { deleteFollowUsers, followUsers, myFollowersId } from "../controllers/followers.controller.js";

const followersRouter = Router();

followersRouter.get("/follow", myFollowersId);
followersRouter.post("/follow", followUsers);
followersRouter.delete("/follow", deleteFollowUsers);

export default followersRouter;