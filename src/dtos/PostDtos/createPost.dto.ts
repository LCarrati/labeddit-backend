import z from "zod"


export interface CreatePostInputDTO {
    token: string,
    content: string
}

export interface CreatePostOutputDTO {
    message: string,
    post_id: string,
    content: string,
    created_at?: string,
    nickname: string
}

export const createPostSchema = z.object({
    token: z.string().min(3),
    content: z.string().min(3)
}).transform(data => data as CreatePostInputDTO)