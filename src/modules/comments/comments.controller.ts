import * as commentService from "./comments.service";
import type { Request, Response, NextFunction } from "express";

export async function getCommentHandler(req: Request, res: Response, next: NextFunction) {
    const pId = req.params.postId; // Updated to match postId route param

    if (!pId || typeof pId !== "string") {
        return res.status(400).json({
            success: false,
            message: "postId should be of type string",
        });
    }

    try {
        const result = await commentService.getCommentsFromPosts(pId);

        return res.status(200).json({
            success: true,
            message: "Comments fetch successful",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch comments",
            error: error.message,
        });
    }
}

export async function getCommentByIdHandler(req: Request, res: Response, next: NextFunction) {
    const pId = req.params.postId;
    const cId = req.params.commentId;

    if (!pId || typeof pId !== "string" || !cId || typeof cId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid postId or commentId parameters",
        });
    }

    try {
        const result = await commentService.getCommentByIdAndPost(pId, cId);

        return res.status(200).json({
            success: true,
            message: "Comment fetch successful",
            data: result,
        });
    } catch (error: any) {
        return res.status(404).json({
            success: false,
            message: error.message || "Failed to fetch comment",
        });
    }
}

export async function deleteCommentHandler(req: Request, res: Response, next: NextFunction) {
    const cId = req.params.commentId;
    const pId = req.params.postId;

    if (!cId || typeof cId !== "string") {
        return res.status(400).json({
            success: false,
            message: "cId should be of type string",
        });
    }
     if (!pId || typeof pId !== "string") {
        return res.status(400).json({
            success: false,
            message: "pId should be of type string",
        });
    }

    try {
        const result = await commentService.deleteComment(pId,cId);

        return res.status(200).json({
            success: true,
            message: "Successful deletion",
            data: result,
        });
    } catch (error: any) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

export async function updateCommentHandler(req: Request, res: Response, next: NextFunction) {
   
    const pId = req.params.postId;
    const cId = req.params.commentId;
    const data = req.body;

    if (!cId || typeof cId !== "string") {
        return res.status(400).json({
            success: false,
            message: "cId should be of type string",
        });
    }
      if (!pId || typeof pId !== "string") {
        return res.status(400).json({
            success: false,
            message: "pId should be of type string",
        });
    }

    try {
        const result = await commentService.updateComment(pId,cId, data);
        
        return res.status(200).json({
            success: true,
            message: "Successful update",
            data: result,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function commentCreationHandler(req: Request, res: Response, next: NextFunction){
    const pId = req.params.postId
    const uId = res.locals.user.id
    const data = req.body

       if (!pId || typeof pId !== "string") {
        return res.status(400).json({
            success: false,
            message: "cId should be of type string",
        });
    }
      if (!uId || typeof uId !== "string") {
        return res.status(400).json({
            success: false,
            message: "pId should be of type string",
        });
    }

    try{
        const result = await commentService.createComment(pId,uId,data)

        return res.status(200).json({
            success:true,
            message:"creation sucessful",
            data:result
        })

    }catch(error:any){
        next(error)
    }
}