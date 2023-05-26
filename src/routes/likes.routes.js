import { Router } from 'express';
import { deleteLikesPosts, likesPosts, myLikessId } from '../controllers/likes.controller.js';

const likesRouter = Router();

likesRouter.get("/likes/", myLikessId);
likesRouter.post("/likes", likesPosts);
likesRouter.delete("/likes", deleteLikesPosts);

export default likesRouter;