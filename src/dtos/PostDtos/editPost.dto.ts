import z from "zod"

export interface EditPostInputDTO {
    post_id: string,
    content: string,
    token: string
}

export interface EditPostOutputDTO {
    message: string,
}

export const editPostSchema = z.object({
    post_id: z.string().min(3),
    content: z.string().min(3),
    token: z.string().min(3)
}).transform(data => data as EditPostInputDTO)