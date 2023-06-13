import z from "zod"


export interface CreateCommentInputDTO {
    token: string,
    comment: string,
    post_id: string
}

export interface CreateCommentOutputDTO {
    message: string,
    comment_id: string,
    post_id: string,
    comment: string,
    created_at?: string,
    nickname: string
}

export const createCommentSchema = z.object({
    token: z.string().min(3),
    comment: z.string().min(3),
    post_id: z.string().min(3)
}).transform(data => data as CreateCommentInputDTO)