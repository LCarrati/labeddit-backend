import z from "zod"

export interface LikeDislikeInputDTO {
    post_id: string,
    likeDislike: number,
    token: string
}

export interface LikeDislikeOutputDTO {
    message: string,
}

export const likeDislikeSchema = z.object({
    post_id: z.string().min(3),
    likeDislike: z.number(),
    token: z.string().min(3)
}).transform(data => data as LikeDislikeInputDTO)



export interface LikeDislikeCommentInputDTO {
    comment_id: string,
    likedislike: number,
    token: string
}

export interface LikeDislikeCommentOutputDTO {
    message: string,
}

export const likeDislikeCommentSchema = z.object({
    comment_id: z.string().min(3),
    likedislike: z.number(),
    token: z.string().min(3)
}).transform(data => data as LikeDislikeCommentInputDTO)