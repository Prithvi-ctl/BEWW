import { z } from "zod";


export const updateProfileSchema = z.object({
    username:z.string().min(2).max(80).optional(),
    ppUrl:z.string().url().nullish(),
});


export type profileUpdate = z.infer<typeof updateProfileSchema>
