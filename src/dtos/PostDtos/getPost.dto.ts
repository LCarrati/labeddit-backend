import z from "zod"
import { PostDB } from "../../Models/PostModel"


export interface FindPostInputDTO {
    post_id?: string,
    creator_id?: string,
    token: string
}

export interface FindPostOutputDTO {
    message: string,
    posts: PostDB | PostDB[]
}

export const findPostSchema = z.object({
    post_id: z.string().min(3).optional(),
    creator_id: z.string().min(3).optional(),
    token: z.string().min(3)
}).transform(data => data as FindPostInputDTO)