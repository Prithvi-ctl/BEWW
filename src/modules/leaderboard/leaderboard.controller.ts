import * as leaderboardService from "./leaderboard.service";
import type { Request, Response, NextFunction } from "express";

export async function createLeaderboardHandler(req: Request, res: Response, next: NextFunction) {
    const pId = req.params.postId;
    const uId = req.body.userId; // Or req.user?.id if using authentication middleware
    const data = req.body;

    if (!pId || typeof pId !== "string" || !uId || typeof uId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Missing or invalid postId or userId",
        });
    }

    try {
        const result = await leaderboardService.createLeaderboardEntry(pId, uId, data);

        return res.status(201).json({
            success: true,
            message: "Leaderboard entry created successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to create leaderboard entry",
        });
    }
}

export async function updateLeaderboardHandler(req: Request, res: Response, next: NextFunction) {
    const lId = req.params.id; // Leaderboard entry ID
    
    const data = req.body;

    if (!lId || typeof lId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Missing or invalid leaderboard entry ID ",
        });
    }

    try {
        const result = await leaderboardService.updateLeaderboardEntry(lId, data);

        return res.status(200).json({
            success: true,
            message: "Leaderboard entry updated successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update leaderboard entry",
        });
    }
}

export async function deleteLeaderboardHandler(req: Request, res: Response, next: NextFunction) {
    const lId = req.params.id;
    const uId = req.body.userId;

    if (!lId || typeof lId !== "string" || !uId || typeof uId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Missing or invalid leaderboard entry ID or userId",
        });
    }

    try {
        const result = await leaderboardService.deleteLeaderBoardData(lId, uId);

        return res.status(200).json({
            success: true,
            message: "Leaderboard entry deleted successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(404).json({
            success: false,
            message: error.message || "Failed to delete leaderboard entry",
        });
    }
}

export async function getLeaderboardHandler(req: Request, res: Response, next: NextFunction) {
    const pId = req.params.postId;

    if (!pId || typeof pId !== "string") {
        return res.status(400).json({
            success: false,
            message: "postId should be of type string",
        });
    }

    try {
        const result = await leaderboardService.getLeaderboardData(pId);

        return res.status(200).json({
            success: true,
            message: "Leaderboard fetched successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch leaderboard",
        });
    }
}