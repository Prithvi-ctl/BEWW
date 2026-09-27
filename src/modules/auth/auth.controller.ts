import type {Request,Response,NextFunction} from 'express';
import * as authService from './auth.service'
import { access } from 'node:fs';


export async function RegistrationHandler(req:Request,res:Response,next:NextFunction){
    try{
        const result = await authService.registerUser(req.body)

        return res.status(201).json({
            success:true,
            message:result.message,
            data:result.user,
        });
    }catch(error:any){
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

export async function emailVerificationHandler(req:Request,res:Response,next:NextFunction){
    try{
        const token = req.query.token;
        if(typeof token !== "string"){
            return res.status(200).json({message:"This token seems to have expired."})
        }
        const result = await authService.verifyEmail(token)
        return res.status(201).json({
            success:true,
            message:"Verification email has been sent to your mail",
            
        })

    }catch(error){
        return res.status(400).json({
            success:false,
            mesasge:error
        })
    }
}

export async function reEmailVerificationHandler(req:Request,res:Response,next:NextFunction){
    try{
        const email = req.body.email;
        const result = await authService.resendVerificationEmail(email)
        return res.status(201).json({
            success:true,
            message:"A new verification email has been sent to your email account."
        })

    }catch(error){

    }
}
export async function loginHandler(req:Request,res:Response,next:NextFunction){
    try{
        const accessToken = await authService.login(req.body);

        return res.status(200).json({
            success:true,
            message:"Logged in Sucessfully",
            data:{
                accessToken,
            },
        });
    }catch(error:any){
        return res.status(401).json({
            success:false,
            message:error.message
        });
    }
}

