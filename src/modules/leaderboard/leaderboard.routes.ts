import { Router } from "express";
import {
    createLeaderboardHandler,
    updateLeaderboardHandler,
    deleteLeaderboardHandler,
    getLeaderboardHandler,
} from "./leaderboard.controller";

// mergeParams: true allows access to :postId from parent router paths
const router = Router({ mergeParams: true });

// GET leaderboard for a post
// Route: GET /api/posts/:postId/leaderboard
router.get("/", getLeaderboardHandler);

// POST a new score entry for a post
// Route: POST /api/posts/:postId/leaderboard
router.post("/", createLeaderboardHandler);

// PATCH / UPDATE a leaderboard score entry by entry ID
// Route: PATCH /api/posts/:postId/leaderboard/:id
router.patch("/:id", updateLeaderboardHandler);

// DELETE a leaderboard score entry by entry ID
// Route: DELETE /api/posts/:postId/leaderboard/:id
router.delete("/:id", deleteLeaderboardHandler);

export default router;