import { Router } from "express";
import { deleteFollowUsers, followUsers, followingsId, myFollowersId } from "../controllers/followers.controller.js";

const followersRouter = Router();

followersRouter.get("/follow/:id", myFollowersId);
followersRouter.get("/following/:id", followingsId);
followersRouter.post("/follow", followUsers);
followersRouter.delete("/follow/:id", deleteFollowUsers);

export default followersRouter;