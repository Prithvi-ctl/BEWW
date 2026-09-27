import {prisma} from "../../config/prisma"
import type { profileUpdate } from "./users.validation"

export async function getProfile(userId:string){
    try{
    const result = await prisma.user.findUnique({where:{id:userId},
        select:{
            id:true,
            username:true,

        }}
    )

    if(!result){
        throw new Error("This account doesn't exist.")
    }

    return result;
    
    }catch(error:any){
        if (error.message === "This account doesn't exist.") {
            throw error;
        }
        
        // Log the actual error for debugging on your server side
        console.error("Error fetching profile:", error);
        
        throw new Error("Sorry, something occurred.");
    }
    
}


export async function updateProfile(newData:profileUpdate,uid:any){
    try{
    const result = await prisma.user.update({where:{id:uid},
        data:{
            ...(newData.username !== undefined && { username: newData.username }),
            ...(newData.ppUrl !== undefined && { ppUrl: newData.ppUrl }),

        },
        select:{
            id:true,
            username:true,
            ppUrl:true,
            email:true
        }})

        if(!result){
            throw new Error("Failed to update the profile.")
        }
        return result;
    }catch(error){
        throw error;
    }


}

export async function deleteUser(uId: string) {
    try {
        return await prisma.user.delete({
            where: { id: uId },
        });
    } catch (error: any) {
        // P2025 is Prisma's error code for "Record to delete does not exist"
        if (error.code === "P2025") {
            throw new Error("This account doesn't exist.");
        }
        
        throw new Error("Sorry, something occurred.");
    }
}

