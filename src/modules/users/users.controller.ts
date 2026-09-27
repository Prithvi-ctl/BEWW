import type {Request,Response,NextFunction} from 'express';
import * as userService from "./users.service"


export async function getProfile(req:Request,res:Response,next:NextFunction){
        const uId = res.locals.user.id;
        if (typeof uId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID provided.",
        });
    }

        try{
            const result = await userService.getProfile(uId)
            
            return res.status(200).json({
                success:false,
                data:result
            });


        }catch(error:any){
            if(error.message === "This account doesn't exist")
                return res.status(404).json({
                    success:false,
                    message:error.message
                })


            return res.status(500).json({
                success:false,
                message:error.message||"Sorry, something occured."
            })
        }


}   

export async function removeProfile(req:Request,res:Response,next:NextFunction){
    const uId = res.locals.user.id;

    if(typeof uId !== "string"){
        return res.status(400).json({
            success:false,
            message:"Invalid userId provided."
        })
    }
    try{
    const result = await userService.deleteUser(uId);
        return res.status(200).json({
            success:true,
            message:"Account deleted Sucessfully"
        })
    }catch(error:any){
        if(error.message === "This account doesn't exist.") {
            return res.status(404).json({message:error.message})
        }

         if(error.message === "Sorry, something occurred.") {
            return res.status(500).json({message:error.message})
        }

    }
}

export async function profileUpdateHandler(req:Request,res:Response,next:NextFunction){

    const uId = res.locals.user.id;
    const data = req.body;

     if(typeof uId !== "string"){
        return res.status(400).json({
            success:false,
            message:"Invalid userId provided."
        })
    }

    try{
        const result = await userService.updateProfile(data,uId);
        return res.status(200).json({
            success:true,
            message:"User profile data sucessfully updated."
        })

    }catch(error:any){

        if(error.message === "Failed to update the profile."){
        return res.status(404).json({
            success:false,
            message:error.message
        })
    }

    return res.status(500).json({
                success:false,
                message:error.message||"Sorry, something occured."})


    }


}