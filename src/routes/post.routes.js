import { Router } from "express";
import { myPostId, postImage, timeLine } from "../controllers/post.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { postImageSchema } from "../schemas/post.schema.js";

const postRouter = Router();

postRouter.post("/postimage", validateSchema(postImageSchema),postImage);
postRouter.get("/myposts", myPostId);
postRouter.get("/timeline", timeLine);

export default postRouter;