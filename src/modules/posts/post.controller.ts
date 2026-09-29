import type {Request,Response,NextFunction} from 'express'
import * as postService from './post.service'
import { success } from 'zod'

export async function getPost(req:Request,res:Response,next:NextFunction){
    try{
        const result = await postService.getPosts()

        return res.status(200).json({
            success:true,
            message:"Sucessfully fetched",
            data:result
        })
    }
    catch(error:any){
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

export async function getPostById(req:Request,res:Response,next:NextFunction){
    const pId = req.params.id;

    if (typeof pId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid post ID provided.",
        });
    }

    try{
        const result = await postService.getPostById(pId)

        return res.status(200).json({
            success:true,
            message:"Sucessfully fetched",
            data:result
        })
    }catch(error:any){
        return res.status(404).json({
            success:false,
            message:error.message
    })
    }

}

export async function deletePost(req:Request,res:Response,next:NextFunction){
    const uId = res.locals.user.id;
    const pId  = req.params.id;

     if (typeof pId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid post ID provided.",
        });
    }

     if (typeof uId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID provided.",
        });
    }

    try{
        const result = await postService.deletePost(pId);

        return res.status(200).json({
            success:true,
            message:"Sucessfully deleted"
        })
    }catch(error:any){
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }


    
}

export async function createPost(req:Request,res:Response,next:NextFunction){
    const uId = res.locals.user.id;

    if(typeof uId !== "string"){
        return res.status(400).json({
            success:false,
            message:"Invalid userId provided."
        })
    }
    const data = req.body;
    try{
        const result = await postService.uploadPost(uId,data);

        return res.status(200).json({
            success:true,
            message:"Successfully uploaded",
            data:result
        })
    }catch(error:any){
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

export async function updatePost(req:Request,res:Response,next:NextFunction){
    const pId = req.params.id
    const uId = res.locals.user.id
    const data = req.body;

    if(typeof pId !== "string"){
        return res.status(400).json({
            success:false,
            message:"The provided postId doesn't exist"
        })
    }


    if(typeof uId !== "string"){
        return res.status(400).json({
            success:false,
            message:"The provided userId doesn't exist"
        })
    }


    try{
        const result = await postService.updatePost(pId,uId,data)

        return res.status(200).json({
            success:true,
            message:"Successfully updated the post.",
            data:result
        })
    }catch(error:any){
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

export async function votePostHandler(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;
    const { type } = req.body; // Expects { type: "LIKE" } or { type: "DISLIKE" }
    const userId = req.body.userId; // Swap to req.user.id once auth is implemented

    if (!postId || typeof postId !== "string") {
        return res.status(400).json({ success: false, message: "Invalid postId" });
    }

    if (!type || !["LIKE", "DISLIKE"].includes(type)) {
        return res.status(400).json({ success: false, message: "Invalid vote type. Must be 'LIKE' or 'DISLIKE'." });
    }

    try {
        const result = await postService.handlePostVote(userId, postId, type);

        return res.status(200).json({
            success: true,
            message: "Post vote updated successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to vote on post",
        });
    }
}