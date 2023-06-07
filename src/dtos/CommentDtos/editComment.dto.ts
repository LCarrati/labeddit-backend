import z from "zod"


export interface EditCommentInputDTO {
    comment_id: string,
    token: string,
    newContent: string
}

export interface EditCommentOutputDTO {
    message: string,
}

export const editCommentSchema = z.object({
    comment_id: z.string().min(3),
    token: z.string().min(3),
    newContent: z.string().min(3)
}).transform(data => data as EditCommentInputDTO)