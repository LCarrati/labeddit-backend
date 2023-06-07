export interface LikeDislikeDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface LikeDislikeCommentDB {
    comment_id: string,
    user_id: string,
    like: number
}