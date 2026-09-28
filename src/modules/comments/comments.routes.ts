import { Router } from "express";
import {
    getCommentHandler,
    getCommentByIdHandler,
    deleteCommentHandler,
    updateCommentHandler,
    commentCreationHandler
} from "./comments.controller";
import { authenticate } from "../../middlewares/auth.middleware";
// mergeParams: true allows this router to access params from parent routers (like :postId)
const router = Router({ mergeParams: true });

// GET all comments for a specific post
// Route: GET /api/posts/:postId/comments
router.get("/", getCommentHandler);

router.post("/",authenticate,commentCreationHandler)

// GET a single specific comment by its ID and post ID
// Route: GET /api/posts/:postId/comments/:commentId
router.get("/:commentId", getCommentByIdHandler);

// PATCH (update) a specific comment
// Route: PATCH /api/posts/:postId/comments/:commentId
router.patch("/:commentId",authenticate, updateCommentHandler);

// DELETE a specific comment
// Route: DELETE /api/posts/:postId/comments/:commentId
router.delete("/:commentId",authenticate, deleteCommentHandler);

export default router;