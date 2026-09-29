import type { commentUpdate, commentUpload } from "./comments.validation";
import { prisma } from '../../config/prisma';


export async function getCommentsFromPosts(postId: string) {
    return await prisma.comment.findMany({
        where: {
            postId: postId, // Fixed from id: postId
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            likes: true,
            dislikes: true,
            parentId: true,
            user: {
                select: {
                    username: true,
                    ppUrl: true,
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    });
}

export async function getCommentByIdAndPost(postId: string, cId: string) {
    // Uses findFirst to safely validate against both postId and comment id
    const comment = await prisma.comment.findFirst({
        where: {
            id: cId,
            postId: postId,
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            likes: true,
            dislikes: true,
            parentId: true,
            user: {
                select: {
                    username: true,
                    ppUrl: true,
                },
            },
        },
    });

    if (!comment) {
        throw new Error("Comment not found for this post.");
    }

    return comment;
}




export async function updateComment(postId: string, cId: string, data: commentUpdate) {
    // 1. Check using BOTH ids to ensure security and validity
    const existingComment = await prisma.comment.findFirst({
        where: { id: cId, postId: postId }
    });

    if (!existingComment) {
        throw new Error("Comment not found for this post.");
    }
        
    return await prisma.comment.update({
        where: { id: cId }, // Prisma update still uses the unique ID safely here
        data: {
            ...(data.content && { content: data.content })
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            likes: true,
            dislikes: true,
            parentId: true,
            user: {
                select: {
                    username: true,
                    ppUrl: true,
                },
            },
        },
    });
}

export async function deleteComment(postId: string, cId: string) {
    const existingComment = await prisma.comment.findFirst({
        where: { id: cId, postId: postId }
    });

    if (!existingComment) {
        throw new Error("Comment not found for this post.");
    }

    return await prisma.comment.delete({
        where: { id: cId }
    });
}

export async function createComment(pId:string,uId:string,data:commentUpload){
    return await prisma.comment.create({
            data:{
                postId:pId,
                userId:uId,
                content:data.content,
                likes:data.likes,
                dislikes:data.dislikes
            },select:{
                content:true,
                likes:true,
                dislikes:true,
                user:{
                    select:{
                        username:true
                    }
                }
            }
    })
}


export async function handleCommentVote(userId: string, postId: string, commentId: string, voteType: "LIKE" | "DISLIKE") {
    // 1. Verify the comment exists AND belongs to this specific post
    const existingComment = await prisma.comment.findFirst({
        where: { id: commentId, postId: postId }
    });

    if (!existingComment) {
        throw new Error("Comment not found for this post.");
    }

    // 2. Check if this user has already voted on this comment
    const existingVote = await prisma.commentVote.findUnique({
        where: {
            userId_commentId: { userId, commentId }
        }
    });

    return await prisma.$transaction(async (tx) => {
        // SCENARIO 1: No previous vote -> Create it and increment counter
        if (!existingVote) {
            await tx.commentVote.create({
                data: { userId, commentId, type: voteType }
            });

            return await tx.comment.update({
                where: { id: commentId },
                data: voteType === "LIKE" ? { likes: { increment: 1 } } : { dislikes: { increment: 1 } }
            });
        } 

        // SCENARIO 2: Clicking the exact same button again -> Delete vote (Toggle off)
        if (existingVote.type === voteType) {
            await tx.commentVote.delete({
                where: { id: existingVote.id }
            });

            return await tx.comment.update({
                where: { id: commentId },
                data: voteType === "LIKE" ? { likes: { decrement: 1 } } : { dislikes: { decrement: 1 } }
            });
        } 

        // SCENARIO 3: Switching from Like to Dislike (or vice versa)
        await tx.commentVote.update({
            where: { id: existingVote.id },
            data: { type: voteType }
        });

        return await tx.comment.update({
            where: { id: commentId },
            data: voteType === "LIKE" 
                ? { likes: { increment: 1 }, dislikes: { decrement: 1 } } 
                : { likes: { decrement: 1 }, dislikes: { increment: 1 } }
        });
    });
}