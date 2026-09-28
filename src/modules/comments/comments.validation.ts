import {z} from "zod"


    const commentSchema = z.object({
        content:z.string(),
        likes:z.int().default(0),
        dislikes:z.int().default(0)
    })

export type commentUpload = z.infer<typeof commentSchema>


const updateCommentSchema = z.object({
    content:z.string()
})

export type commentUpdate = z.infer<typeof updateCommentSchema>