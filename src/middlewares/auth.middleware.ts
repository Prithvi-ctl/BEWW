import type  {Request,Response,NextFunction} from "express";
import jwt from 'jsonwebtoken';

export type AuthenticatedUser = { id:string;email:string};
type AccessTokenPayload = {sub?: string;email?:string;role:string}
    

export function authenticate(req:Request,res:Response,next:NextFunction){
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith('Bearer')?authorization.slice(7):null;
    const secret = process.env.JWT_ACCESS_SECRET

    if(!token || !secret)
        return   res.status(401).json({success:false,
    message:"You must be signed in to continue."})
    

    try{
        const payload = jwt.verify(token,secret) as AccessTokenPayload;
        if(!payload.sub || !payload.email ){
          return  res.status(401).json({success:false,message:"Your session is invalid. Please login again."});
        }
        res.locals.user = {id:payload.sub,email:payload.email};
        next();

    }catch(error:any){
             return  res.status(401).json({success:false,message:'Your session has expired. Please log in again.'});

    }
}