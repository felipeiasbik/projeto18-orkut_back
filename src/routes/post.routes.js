import { Router } from "express";
import { myPost, myPostId, postImage, timeLine } from "../controllers/post.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { postImageSchema } from "../schemas/post.schema.js";

const postRouter = Router();

postRouter.post("/postimage", validateSchema(postImageSchema),postImage);
postRouter.get("/myposts", myPost);
postRouter.get("/myposts/:id", myPostId);
postRouter.get("/timeline", timeLine);

export default postRouter;