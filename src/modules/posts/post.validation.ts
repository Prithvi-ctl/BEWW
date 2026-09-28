import type { profile } from 'node:console'
import {z} from 'zod'

export const coordinateSchema = z.object({
    x:z.number().min(0).max(100),
    y:z.number().min(0).max(100),
    radius:z.number().positive().default(5.0),
    label:z.string().optional()


})
export const postSchema = z.object({
    imageUrl:z.string(),
    contentDescription:z.string(),
    targetCoordinates:z.array(coordinateSchema).min(1)
})

export const updatePostSchema = z.object({
    imageUrl:z.string().optional(),
    contentDescription:z.string().optional(),
    targetCoordinates:z.array(coordinateSchema).min(1)


})


export type postUpdate = z.infer<typeof updatePostSchema>
export type postUpload =  z.infer<typeof postSchema>