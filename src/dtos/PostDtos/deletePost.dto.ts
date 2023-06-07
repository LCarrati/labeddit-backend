import z from "zod"


export interface DeletePostInputDTO {
    post_id: string,
    token: string
}

export interface DeletePostOutputDTO {
    message: string,
}

export const deletePostSchema = z.object({
    post_id: z.string().min(3),
    token: z.string().min(3)
}).transform(data => data as DeletePostInputDTO)