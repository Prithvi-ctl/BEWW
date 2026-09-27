import {z} from "zod";
 
export const registerSchema = z.object({
    username:z.string().trim().min(3).max(80),
    email: z.string().email({message:"Invalid email format"}),  
    password:z.string().trim().min(8)
})


export const loginSchema = z.object({
    email: z.string().email({message:"Invalid email format"}),  
    password:z.string().trim().min(8)
})

//typescript type inference
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

