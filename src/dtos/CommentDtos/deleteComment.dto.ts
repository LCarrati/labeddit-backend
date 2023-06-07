import z from "zod"


export interface DeleteCommentInputDTO {
    comment_id: string,
    token: string,
}

export interface DeleteCommentOutputDTO {
    message: string,
}

export const deleteCommentSchema = z.object({
    comment_id: z.string().min(3),
    token: z.string().min(3)
}).transform(data => data as DeleteCommentInputDTO)