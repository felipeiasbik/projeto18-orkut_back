import { Router } from "express";
import { myPostId, postImage } from "../controllers/post.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const postRouter = Router();

postRouter.post("/postImage", validateSchema(),postImage);
postRouter.get("/myPosts/:id", myPostId);

export default postRouter;