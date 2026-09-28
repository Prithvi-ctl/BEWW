import {prisma} from '../../config/prisma'
import type { leaderBoardCreate,updateLeaderBoard } from './leaderboard.validation'


export async function createLeaderboardEntry(pId:string,uId:string,data:leaderBoardCreate){
    return await prisma.leaderboard.create({
        data:{
            postId:pId,
            userId:uId,
            timer:data.timer,
            score:data.score

        },
        select:{
            userId:true,
            postId:true,
            timer:true,
            user:{
                select:{
                    username:true
                }
            }
        }
    })
}

export async function updateLeaderboardEntry(lId:string,data:updateLeaderBoard){
        return await prisma.leaderboard.update({
            where:{
                id:lId,
                
            },
            data:{
                ...(data.timer && {timer:data.timer}),
                ...(data.score && {score:data.score})
            },
            select:{
                userId:true,
                postId:true,
                timer:true,
                user:{
                    select:{
                        username:true
                }
            }
            }
        })
}


export async function deleteLeaderBoardData(lId:string,uId:string){
    return await prisma.leaderboard.delete({
        where:{
            id:lId,
            userId:uId
        }
    })
}

export async function getLeaderboardData(pId:string){
    return await prisma.leaderboard.findMany({
        where:{
            postId:pId
        },
        select:{
            timer:true,
            score:true,
            user:{
                select:{
                    username:true
                }
            }
        }
    })
}