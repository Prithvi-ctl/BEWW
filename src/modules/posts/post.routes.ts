import { Router } from "express";
import * as postController from "./post.controller"
import { authenticate } from "../../middlewares/auth.middleware";


const router = Router();


router.get('/posts',postController.getPost)
router.get('/posts/:id',postController.getPostById)
router.post('/posts/:id',authenticate,postController.updatePost)
router.post('/posts',authenticate,postController.createPost)
router.post('/posts:id',authenticate,postController.deletePost)

export default router