import {prisma} from "../../config//prisma"
import jwt from 'jsonwebtoken'
import {resolveMx} from 'node:dns/promises';
import type { RegisterInput,LoginInput } from "./auth.validation"
import {createHash,randomBytes} from 'node:crypto';
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from "../../utils/email";


async function emailDomainAcceptsMail(email:string){
    const domain = email.slice(email.lastIndexOf('@')+1);
    try{
        return (await resolveMx(domain)).length > 0;
    }catch{
        return false;
    }
}

function createAccessToken(user:{id:string,email:string}){
    const secret = process.env.JWT_ACCESS_SECRET;
    if(!secret) throw new Error('JWT_ACCESS_SECRET is required');
    return jwt.sign({sub:user.id,email:user.email},secret,{expiresIn:'1h'});

}

function hashToken(token:string){
    return createHash('sha256').update(token).digest('hex');
}

async function createVerificationToken(userId:string){
    const rawToken = randomBytes(32).toString('hex');
    await prisma.emailVerificationToken.deleteMany({where:{userId}})
    await prisma.emailVerificationToken.create({
        data:{
            userId,
            token:hashToken(rawToken),
            expiresAt:new Date(Date.now() + 2*60*1000)
        },
    });

    return rawToken;
}

export async function registerUser(input: RegisterInput) {
    // 1. Check if email domain actually accepts mail
    const isValidDomain = await emailDomainAcceptsMail(input.email);
    if (!isValidDomain) {
        throw new Error('That email domain cannot receive mail. Please use a valid email address.');
    }

    // 2. Create the user in the database
    const user = await prisma.user.create({
        data: {
            username: input.username,
            email: input.email,
            password: await bcrypt.hash(input.password, 12),
        },
        select: { id: true, username: true, email: true, isEmailVerified: true }
    });

    // 3. Handle verification email (with rollback if email sending fails)
    try {
        const verificationToken = await createVerificationToken(user.id);
        await sendVerificationEmail(user.email, user.username, verificationToken);
    } catch (emailError) {
        await prisma.user.delete({ where: { id: user.id } });
        throw emailError;
    }

    // 4. SUCCESS: Return the safe user data (DO NOT throw here!)
    return {
        message: "Account created. Verify your account before signing in.",
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        }
    };
}

export async function verifyEmail(token:string){
    try{
        const verificationToken = await prisma.emailVerificationToken.findUnique({where:{token:hashToken(token)}});

        if(!verificationToken || verificationToken.expiresAt < new Date()){
            throw new Error("This verification token is invalid or expired.")
        }

        await prisma.$transaction([
            prisma.user.update({where:{id:verificationToken.userId},data:{isEmailVerified:true}}),
            prisma.emailVerificationToken.deleteMany({where:{id:verificationToken.id}})
        ]);
        
    }catch(error){
        throw error
    }
}


export async function resendVerificationEmail(email:string){
    try{
        const user =await  prisma.user.findUnique({where:{email}}) ;
        if(user && !user.isEmailVerified){
            const verificationToken = await createVerificationToken(user.id);
        await sendVerificationEmail(user.email,user.username,verificationToken);

        }
        throw ("If account needs verification a new verification mail has been sent.")
    }catch(error){
        throw error
    }
};

export async function login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    
    const passwordMatches = user ? await bcrypt.compare(input.password, user.password) : false;
    
    if (!user || !passwordMatches) {
        throw new Error("The email or the password is incorrect");
    }
    
    if (!user.isEmailVerified) {
        throw new Error("Verify your email before signing in.");
    }   

    const safeUser = { id: user.id, username: user.username, email: user.email };
    
    return createAccessToken(safeUser);
}