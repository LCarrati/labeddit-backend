import z from "zod"

export interface FindCommentInputDTO {
    comment_id: string,
    token: string,
}

export interface FindCommentOutputDTO {
    message: string,
    post_id: string,
    comment: string,
    likes: number,
    dislikes: number,
    created_at?: string,
    updated_at?: string,
    nickname: string
}

export const findCommentSchema = z.object({
    comment_id: z.string().min(3),
    token: z.string().min(3)
}).transform(data => data as FindCommentInputDTO)


export interface GetAllCommentsInputDTO {
    post_id: string,
    token: string,
}

export interface GetAllCommentsOutputDTO {
    post_id: string,
    comment: string,
    likes: number,
    dislikes: number,
    created_at?: string,
    updated_at?: string,
    nickname: string
}

export const getAllCommentsSchema = z.object({
    post_id: z.string().min(3),
    token: z.string().min(3)
}).transform(data => data as GetAllCommentsInputDTO)