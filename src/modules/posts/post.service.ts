import {prisma} from '../../config/prisma'
import type { postUpload,postUpdate} from './post.validation'


export async function getPost(page=1,limit=10){
    try{
        const skip = (page -1)* limit;
        const result = await prisma.post.findMany({
            skip,
            take:limit,
            orderBy:{
                createdAt:'desc'
            },
            include:{
                targetCoordinates:true,
                user:{
                    select:{
                        username:true,
                        email:true
                    }
                },
                comments:{
                    select:{
                        user:{
                            select:{
                                username:true
                            }
                        },
                        content:true,
                        likes:true,
                        dislikes:true,
                        createdAt:true
                    }
                },
                leaderboard:{
                    select:{
                        score:true,
                        timer:true,
                        user:{
                            select:{
                                username:true
                            }
                        }
                    }
                }
            } 
        })
        return result;
    }catch(error){
        console.error("error fetching posts",error);
        throw new Error("Could not fetch posts");
    }
}

export async function getPostById(pId:any){
    try{
        const result = await prisma.post.findUnique({
            where:{id:pId},
            
            include:{
                targetCoordinates:true,
                user:{
                    select:{
                        username:true,
                        email:true
                    }
                },
                comments:{
                    select:{
                        user:{
                            select:{
                                username:true
                            }
                        },
                        content:true,
                        likes:true,
                        dislikes:true,
                        createdAt:true
                    }
                },
                leaderboard:{
                    select:{
                        score:true,
                        timer:true,
                        user:{
                            select:{
                                username:true
                            }
                        }
                    }
                }
            } 
        })
    }catch(error){
        throw error
    }
}
export async function uploadPost(uId:any,data:postUpload){

    try{
        const result = await prisma.post.create({
            data:{
                userId:uId,
                imageUrl:data.imageUrl,
                contentDescription:data.contentDescription,
                targetCoordinates:{
                    create:data.targetCoordinates.map((coord)=>({
                        x:coord.x,
                        y:coord.y,
                        label:coord.label ?? null,
                        radius:coord.radius
                    })),
                },


            },select: {
                id: true,
                imageUrl: true,
                contentDescription: true,
                createdAt: true,
                targetCoordinates: true, // Returns the coordinates array
                user: {
                    select: {
                        username: true, // Only returns the username, hiding email/password/etc.
                    },
                },
            }
        })

        return result;
    }catch(error){
        throw error;
    }
}


export async function deletePost(pId:any){
    try{
        const result = await prisma.post.delete({
            where:{
                id:pId
            }
        })

        return result;
    }catch(error){
        throw error
    }
}

export async function updatePost(pId:any,uId:any,data:postUpdate){
    try{

        const existingPost = await prisma.post.findUnique({
            where:{
                id:pId
            }
        })

        if(!existingPost) throw new Error("Post not found")

        if(existingPost.userId !== uId) throw new Error("Unauthorized to update this post.")
        const result = await prisma.post.update({
            where:{
                id:pId
            },
           data: {
                // Only include fields if they are actually provided (not undefined)
                ...(data.imageUrl && { imageUrl: data.imageUrl }),
                ...(data.contentDescription !== undefined && { 
                    contentDescription: data.contentDescription ?? null 
                }),
                
                // If you also want to allow updating/resetting coordinates during an update:
                ...(data.targetCoordinates && {
                    targetCoordinates: {
                        deleteMany: {}, // Clear old coordinates if updating them
                        create: data.targetCoordinates.map((coord) => ({
                            x: coord.x,
                            y: coord.y,
                            radius: coord.radius,
                            label: coord.label ?? null,
                        })),
                    },
                }),
           },
           select: {
                id: true,
                imageUrl: true,
                contentDescription: true,
                createdAt: true,
                targetCoordinates: true, // Returns the coordinates array
                user: {
                    select: {
                        username: true, // Only returns the username, hiding email/password/etc.
                    },
                },
            }
            
        })
        return result;
    }catch(error){
        throw error
    }
}