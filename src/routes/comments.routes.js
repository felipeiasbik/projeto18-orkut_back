import { Router } from "express";
import { createComment, getComment } from "../controllers/comments.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { commentsSchema } from "../schemas/comments.schema.js";

const commentsRouter = Router();

commentsRouter.post("/comments", validateSchema(commentsSchema),createComment);
commentsRouter.get("/comments", getComment);

export default commentsRouter;