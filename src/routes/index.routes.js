import { Router } from 'express';
import authRouter from './auth.routes.js';
import postRouter from './post.routes.js';
import followersRouter from './followers.routes.js';
import likesRouter from './likes.routes.js';
import commentsRouter from './comments.routes.js';
import searchRouter from './search.routes.js';

const router = Router();
router.use(authRouter);
router.use(postRouter);
router.use(commentsRouter);
router.use(followersRouter);
router.use(likesRouter);
router.use(searchRouter);

export default router;